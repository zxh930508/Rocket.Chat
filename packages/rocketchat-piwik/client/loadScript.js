Template.body.onRendered(() => {
	Tracker.autorun((c) => {
		let url = RocketChat.settings.get('PiwikAnalytics_url');
		let siteId = RocketChat.settings.get('PiwikAnalytics_siteId');

		if (Match.test(url, String) && url.trim() !== '' && Match.test(siteId, String) && siteId.trim() !== '') {
			c.stop();
			window._paq = window._paq || [];
			if (Meteor.userId()) {
				window._paq.push(['setUserId', Meteor.userId()]);
			}

			window._paq.push(['trackPageView']);
			window._paq.push(['enableLinkTracking']);
			(() => {
				window._paq.push(['setTrackerUrl', url + 'piwik.php']);
				window._paq.push(['setSiteId', Number.parseInt(siteId)]);
				let d = document;
				let g = d.createElement('script');
				let s = d.getElementsByTagName('script')[0];
				g.type = 'text/javascript';
				g.async = true;
				g.defer = true;
				g.src = url + 'piwik.js';
				s.parentNode.insertBefore(g, s);
			})();
		}
	});
});

//Track logins and associate user ids with piwik
(() => {
	let oldUserId = null;

	Meteor.autorun(() => {
		let newUserId = Meteor.userId();
		if (oldUserId === null && newUserId) {
			if (window._paq) {
				window._paq.push(['trackEvent', 'User', 'Login', newUserId ]);
				window._paq.push(['setUserId', newUserId]);
			}
		} else if (newUserId === null && oldUserId) {
			if (window._paq) {
				window._paq.push(['trackEvent', 'User', 'Logout', oldUserId ]);
			}
		}
		oldUserId = Meteor.userId();
	});
})();