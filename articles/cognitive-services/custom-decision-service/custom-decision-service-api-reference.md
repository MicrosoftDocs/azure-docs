---
title: Azure Custom Decision Service API reference | Microsoft Docs
description: A complete and user-friendly API guide for Azure Custom Decision Service, a cloud-based API for contextual decision-making that sharpens with experience.
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 05/03/2017
ms.author: slivkins;marcozo;alekh
---

# Custom Decision Service API reference

Azure Custom Decision Service provides two APIs that are invoked for each decision: the [Ranking API](#ranking-api) to input the ranking of actions and the [Reward API](#reward-api) to output the reward. In addition, you provide an [Action Set API](#action-set-api-customer-provided) to specify the actions to Azure Custom Decision Service. This article covers these three APIs. For ease of presentation, we focus on a typical scenario when Custom Decision Service optimizes the ranking of articles.

## Ranking API

The ranking API uses a standard [JSONP](https://en.wikipedia.org/wiki/JSONP)-style communication pattern to optimize latency and bypass the [same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy). (The latter prohibits JavaScript from fetching data from outside the page's origin.)

Insert the following snippet into the HTML head of the front page. Here by "front page," we mean the page that displays the personalized list of articles:

```html
// define the "callback function" to render UI
<script> function callback(data) { … } </script>
// "data" provides the ranking of URLs, see example below.

// call to Ranking API
<script src="https://ds.microsoft.com/api/v2/<appId>/rank/<actionSetId>?<parameters>" async></script>
// action set id is the name of the corresponding RSS/Atom feed.

// same call with multiple action sets:
// <script src="https://ds.microsoft.com/api/v2/<appId>/rank/<A1>/<A2>/.../<An>?<parameters>" async></script>
```

> [!IMPORTANT]
> The callback function must be defined before the call to the Ranking API.

> [!TIP]
> To improve latency, we also expose the Ranking API via HTTP rather than HTTPS, as in `http://ds.microsoft.com/api/v2/<appId>/rank/*`.
> However, an HTTPS endpoint must be used if the front page is served through HTTPS.

When parameters are not specified, the HTTP response from the Ranking API is a JSONP-formatted string, as follows:

```json
callback({
   "ranking":[{"id":"url1"}, {"id":"url2"}, {"id":"url3"}],
   "eventId":"<opaque event string>",
   "appId":"<your app id>",
   "actionSets":[{"id":"<A1>","lastRefresh":"2017-04-29T22:34:25.3401438Z"},
                 {"id":"<A2>","lastRefresh":"2017-04-30T22:34:25.3401438Z"}]});
```

The browser then executes this string as a call to the `callback()` function.

The parameter to the callback function in the preceding example has the following schema:

- `ranking` provides the ranking of URLs to be displayed.
- `eventId` is used internally by Custom Decision Service to match this ranking with the corresponding clicks.
- `appId` allows the callback function to distinguish between multiple applications of Custom Decision Service running on the same webpage.
- `actionSets` lists each action set used in the Ranking API call, along with the UTC timestamp of the last successful refresh. (Custom Decision Service periodically refreshes the action set feeds.) For example, if some of the action sets are not current, the callback function might need to fall back to their default ranking.

> [!IMPORTANT]
> The specified action sets are processed, and possibly pruned, to form the default ranking of articles. The default ranking then gets reordered and returned in the HTTP response. The default ranking is defined as follows:
>
> - Within each action set, the articles are pruned to the 15 most recent articles (if more than 15 are returned).
> - When multiple action sets are specified, they are merged in the same order as in the API call. The original ordering of the articles is preserved within each action set. Duplicates are removed in favor of the earlier copies.
> - The first `n` articles are kept from the merged list of articles, where `n=20` by default.

### Ranking API with parameters

The Ranking API allows the following parameters:

- `details=1` and `details=2` insert auxiliary details about each article listed in `ranking`.
- `limit=<n>` specifies the maximal number of articles in the default ranking. `n` must be between `2` and `30` (or else it is truncated to `2` or `30`, respectively).
- `dnt=1`. This parameter disables user cookies.

Parameters can be combined in standard query string syntax, for example, `details=2&dnt=1`.

> [!IMPORTANT]
> The default setting in Europe should be `dnt=1` until the customer agrees to the cookie banner. It should also be the default setting for websites that target minors. For more information, see the [terms of use](https://www.microsoft.com/cognitive-services/en-us/legal/CognitiveServicesTerms20160804).

The `details=1` element inserts each article's `guid`, if it is served by the Action Set API. Then the HTTP response looks like the following:

```json
callback({
   "ranking":[{"id":"url1","details":[{"guid":"123"}]},
              {"id":"url2","details":[{"guid":"456"}]},
              {"id":"url3","details":[{"guid":"789"}]}],
   "eventId":"<opaque event string>",
   "appId":"<your app id>",
   "actionSets":[{"id":"<A1>","lastRefresh":"timeStamp1"},
                 {"id":"<A2>","lastRefresh":"timeStamp2"}]});
```

The `details=2` element adds more details that Custom Decision Service might extract from articles' SEO metatags (featurization code can be found [here](https://github.com/Microsoft/mwt-ds/tree/master/Crawl):

- `title` from `<meta property="og:title" content="..." />` or `<meta property="twitter:title" content="..." />` or `<title>...</title>`
- `description` from `<meta property="og:description" ... />` or `<meta property="twitter:description" content="..." />` or `<meta property="description" content="..." />`
- `image` from `<meta property="og:image" content="..." />`
- `ds_id` from `<meta name=”microsoft:ds_id” content="..." />`

The HTTP response then looks like the following:

```json
callback({
   "ranking":[{"id":"url1","details":<details>},
              {"id":"url2","details":<details>},
              {"id":"url3","details":<details>}],
   "eventId":"<opaque event string>",
   "appId":"<your app id>",
   "actionSets":[{"id":"<A1>","lastRefresh":"timeStamp1"},
                 {"id":"<A2>","lastRefresh":"timeStamp2"}]});
```

The `<details>` element is of the following form:

```json
[{"guid":"123"}, {"description":"some text", "ds_id":"234", "image":"ImageUrl1", "title":"some text"}]
```

## Reward API

Custom Decision Service uses clicks only on the top slot. Each click is interpreted as a reward of 1. The lack of a click is interpreted as a reward of 0. Clicks are matched with the corresponding rankings by using event IDs, which are generated by the [Ranking API](#ranking-api) call. If needed, event IDs can be passed via session cookies.

To handle a click on the top slot, the following code should be invoked on the front page:

```javascript
$.ajax({
    type: "POST",
    url: '//ds.microsoft.com/<appId>/reward/' + data.eventId,
    contentType: "application/json" })
```

Here `data` is the argument to the `callback()` function, as described previously. Using `data` in the click handling code requires some care. We provide an example in the [tutorial](custom-decision-service-tutorial.md#use-the-apis).

 For testing only, the Reward API can be invoked via [cURL](https://en.wikipedia.org/wiki/CURL):

```sh
curl -v https://ds.microsoft.com/<appId>/reward/<eventId> -X POST -d 1 -H "Content-Type: application/json"
```

The expected effect is an HTTP response of 200 (OK). Assuming that an Azure storage account key was supplied on the portal, you can see the reward of 1 for this event in the log.

## Action Set API (customer provided)

On a high level, the Action Set API returns a list of articles (actions). Each article is specified by the URL of an article and (optionally) the article title and the publication date. You can specify multiple action sets on the portal. A different Action Set API should be specified for each action set, as a distinct URL.

Each Action Set API can be implemented in two ways: as an RSS feed or as an Atom feed. Either one should conform to the respective standard and return a correct XML. For RSS, a representative example is as follows:

```xml
<rss version="2.0">
<channel>
   <item>
      <title><![CDATA[title (possibly with url) ]]></title>
      <link>url</link>
      <guid>guid (could be a your internal database id)</guid>
      <pubDate>date</pubDate>
    </item>
   <item>
       ....
   </item>
</channel>
</rss>
```

Here each top-level `<item>` element describes an action:

- `<link>` is mandatory and is used as an action ID by Custom Decision Service.
- `<date>` is ignored if it's less than or equal to 15 items; otherwise, it's mandatory.
  - If there are more than 15 items, the 15 most recent ones are used.
  - It must be in the standard format for RSS or Atom, respectively:
    - [RFC 822](https://tools.ietf.org/html/rfc822) for RSS: for example, `"Fri, 28 Apr 2017 18:02:06 GMT"`
    - [RFC 3339](https://tools.ietf.org/html/rfc3339) for Atom: for example, `"2016-12-19T16:39:57-08:00"`
- `<title>` is optional and is used to generate features that describe the article.
- `<guid>` is optional and is passed through the system to the callback function (if the `?details` parameter is specified in the Ranking API call).

Other elements inside an `<item>` are ignored.

The Atom feed version uses the same XML syntax and conventions.

> [!TIP]
> If your system uses its own article IDs, they can be passed into the callback function by using `<guid>`.