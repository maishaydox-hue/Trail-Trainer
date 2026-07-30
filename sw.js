const CACHE_NAME = 'trail-trainer-v1'; // שנה את המספר (למשל v2) בכל פעם שאתה מעדכן את האתר

// בדיקת עדכונים מול השרת בכל פעם שהאתר נפתח
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // אם יש אינטרנט והקובץ העדכני ירד בהצלחה, נשמור אותו בזיכרון
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // אם המשתמש באופליין (אין אינטרנט), נטען מהזיכרון של המכשיר
        return caches.match(event.request);
      })
  );
});

// מחיקת זיכרון ישן כשהגרסה משתנה
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
