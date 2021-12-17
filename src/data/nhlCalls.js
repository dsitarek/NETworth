import axios from 'axios';
import { supabase } from '../api/auth';

const statsApi = 'https://statsapi.web.nhl.com/api/v1';

const currentSeason = '20212022';

const removeDuplicatesFromArrayByProperty = (arr, prop) => arr.reduce((accumulator, currentValue) => {
  if (!accumulator.find((obj) => obj[prop] === currentValue[prop])) {
    accumulator.push(currentValue);
  }
  return accumulator;
}, []);

// const getSearchedPlayers = async (userSearch) => {
//   const search = userSearch.replace(/\s/g, '%20');
//   const searchCall = await axios.get(`https://suggest.svc.nhl.com/svc/suggest/v1/minplayers/${search}`);
//   const searchedPlayerReturn = [];
//   const playerDataArr = (searchCall.data.suggestions).map((player) => player.split('|'));
//   playerDataArr.forEach((player) => searchedPlayerReturn.push({
//     id: player[0],
//     name: `${player[2]} ${player[1]}`,
//     team: player[11],
//     position: player[12],
//     playerNumber: player[13],
//   }));
//   console.log(searchCall);
//   return searchedPlayerReturn;
// };
const getCurrentInfo = async (playerId) => {
  const call = await axios.get(`${statsApi}/people/${playerId}`);
  return call.data.people[0];
};

const getSearchedPlayers = async (userSearch) => {
  const { data } = await supabase
    .from('stats_with_grades')
    .select()
    .textSearch('name', userSearch);

  const playerDataArr = removeDuplicatesFromArrayByProperty(data, 'name');
  const searchedPlayerReturn = [];
  playerDataArr.forEach(async (player) => {
    const nhlData = await getCurrentInfo(player.id);
    searchedPlayerReturn.push({
      id: player.id,
      name: player.name,
      team: nhlData.currentTeam.name,
      position: nhlData.primaryPosition.code,
      playerNumber: nhlData.primaryNumber,
    });
  });
  return searchedPlayerReturn;
};

export default getSearchedPlayers;

const getCurrentStats = async (playerId) => {
  const call = await axios.get(`${statsApi}/people/${playerId}/stats?stats=statsSingleSeason&season=${currentSeason}`);
  return call.data.stats[0].splits[0].stat;
};
const getRecentGames = async (playerId) => {
  const call = await axios.get(`${statsApi}/people/${playerId}/stats?stats=gameLog&season=${currentSeason}`);
  const gameIndex = call.data.stats[0].splits;
  return [gameIndex[0], gameIndex[1], gameIndex[2]];
};

export {
  getCurrentStats, getCurrentInfo, getRecentGames, getSearchedPlayers,
};
