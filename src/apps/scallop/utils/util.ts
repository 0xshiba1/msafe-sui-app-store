import { SUPPORT_POOLS, SUPPORT_COLLATERALS, SUPPORT_SPOOLS_REWARDS, MAX_LOCK_DURATION } from '../constants';
import type { SupportAssetCoins, SupportCoins, SupportMarketCoins, SupportPoolCoins } from '../types';

export const isMarketCoin = (coinName: SupportCoins): coinName is SupportMarketCoins => {
  const assetCoinName = coinName.slice(1).toLowerCase() as Omit<
    SupportAssetCoins,
    'scallop_sca' | 'scallop_sui' | 'scallop_deep' | 'scallop_fud'
  >;
  return (
    coinName.charAt(0).toLowerCase() === 's' &&
    [...new Set([...SUPPORT_POOLS, ...SUPPORT_COLLATERALS, ...SUPPORT_SPOOLS_REWARDS])].includes(
      assetCoinName as SupportPoolCoins,
    )
  );
};

export const parseAssetSymbol = (coinName: SupportAssetCoins): string => {
  switch (coinName) {
    case 'afsui':
      return 'afSUI';
    case 'hasui':
      return 'haSUI';
    case 'vsui':
      return 'vSUI';
    default:
      return coinName.toUpperCase();
  }
};

/**
 * Find the closest unlock round timestamp (12AM) to the given unlock at timestamp in seconds.
 *
 * @param unlockAtInSecondTimestamp - Unlock at in seconds timestamp to find the closest round.
 * @returns Closest round (12AM) in seconds timestamp.
 */
export const findClosestUnlockRound = (unlockAtInSecondTimestamp: number) => {
  const unlockDate = new Date(unlockAtInSecondTimestamp * 1000);
  const closestTwelveAM = new Date(unlockAtInSecondTimestamp * 1000);

  closestTwelveAM.setUTCHours(0, 0, 0, 0); // Set the time to the next 12 AM UTC

  // If the current time is past 12 AM, set the date to the next day
  if (unlockDate.getUTCHours() >= 0) {
    closestTwelveAM.setUTCDate(closestTwelveAM.getUTCDate() + 1);
  }

  const now = new Date().getTime();
  // check if unlock period > 4 years
  if (closestTwelveAM.getTime() - now > MAX_LOCK_DURATION * 1000) {
    closestTwelveAM.setUTCDate(closestTwelveAM.getUTCDate() - 1);
  }
  return Math.floor(closestTwelveAM.getTime() / 1000);
};
