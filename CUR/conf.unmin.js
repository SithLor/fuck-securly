/* Copyright 2024 Securly, Inc. All rights reserved. */
var activeTab,
  checkClusterURL = "https://www.securly.com",
  DEBUG_userEmail = "",
  forceUserEmail = false/*!1*/,
  DEBUG_clusterUrl = "https://www.securly.com/crextn",
  forceClusterUrl = false/*!1*/,
  iwfEncodeStep = 3,
  iframeResp = "",
  iframeBlockUrl = "",
  lastKnownState = "unknown";
const tabCheck = [
  "netflix.com",
  "spotify.com",
  "soundcloud.com",
  "disneyplus.com",
  "hulu.com",
  "soundtrap.com",
  "viewpure.com",
  "pandora.com",
  "dailymotion.com",
  "soap2day.is",
  "instagram.com",
  "pinterest.com",
  "vimeo.com",
  "tiktok.com",
  "reddit.com",
  "buzzfeed.com",
  "medium.com",
  "quotev.com",
  "weebly.com",
  "tumblr.com",
  "facebook.com",
  "twitter.com",
  "linkedin.com",
  "plus.google.com",
  "apps.facebook.com",
  "touch.facebook.com",
  "socialblade.com",
  "viki.com",
  "myanimelist.net",
  "mymodernmet.com",
  "coolmathgames.com",
  "scratch.mit.edu",
  "nitrotype.com",
  "roblox.com",
  "poki.com",
  "twitch.tv",
  "crazygames.com",
  "hoodamath.com",
  "krunker.io",
  "friv.com",
  "epicgames.com",
  "sites.google.com",
  "amazon.com/Amazon-Video",
  "amazon.com/gp/video/",
];
