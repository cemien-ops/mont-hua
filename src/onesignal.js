const APP_ID = "7fe9f795-dc4c-488f-a00f-0cd53ec21d39";
const API_KEY = "Basic os_v2_app_7fe9f795dc4c488fa00f0cd53ec21d39";

export const requestPermission = async () => {
  return new Promise(resolve => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function(OneSignal) {
      await OneSignal.Notifications.requestPermission();
      const id = await OneSignal.User.PushSubscription.id;
      resolve(id);
    });
  });
};

export const getOneSignalId = async () => {
  return new Promise(resolve => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function(OneSignal) {
      const id = await OneSignal.User.PushSubscription.id;
      resolve(id);
    });
  });
};

export const sendNotification = async (playerIds, title, message) => {
  if (!playerIds || playerIds.length === 0) return;
  await fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": API_KEY,
    },
    body: JSON.stringify({
      app_id: APP_ID,
      include_player_ids: playerIds,
      headings: { en: title, fr: title },
      contents: { en: message, fr: message },
      small_icon: "ic_stat_onesignal_default",
      large_icon: "https://i.imgur.com/T2e867w.png",
    }),
  });
};
