---
title: Microsoft Azure Custom Decision Service API reference | Microsoft Docs
description: A complete and user-friendly API guide for Microsoft Custom Decision Service, cloud-based API for contextual decision-making that sharpens with experience.
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 05/02/2017
ms.author: slivkins
---

# Custom Decision Service API reference

Microsoft Custom Decision Service provides two APIs that are invoked for each decision: [Ranking API](#ranking-api) to input the ranking of actions, and [Reward API](#reward-api) to output the reward. Further, you should provide an [Action Set API](#action-set-api-customer-provided) to specify the actions to Custom Decision Service. This article covers these three APIs.

## Ranking API

The ranking API uses a standard [JSONP](https://en.wikipedia.org/wiki/JSONP)-style communication pattern to optimize latency and bypass [same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy). (The latter prohibits JavaScript to fetch data from outside the page's origin.)

Insert the following snippet into the HTML head of the front page. Here by the "front page" we mean the page displaying the personalized list of articles.

```html
// define the "callback function" to render UI
<script> function callback(data) { … } </script>
// "data" provides the ranking of URLs, see example below.

// call to Ranking API
<script src="https://ds.microsoft.com/<appId>/rank/<actionSetId>?<parameters>" async></script>

// same call with multiple action sets:
// <script src="https://ds.microsoft.com/<appId>/rank/<A1>/<A2>/.../<An>?<parameters>" async></script>
```

> [!IMPORTANT]
> Callback function must be defined before the call to Ranking API.

> [!TIP]
> To improve latency we also expose Ranking API via HTTP rather than HTTPS, as in `http://ds.microsoft.com/<appId>/rank/*`.
> However, HTTPS endpoint must be used if the front page is served through HTTPS.

When parameters are not specified, HTTP response from Ranking API is a JSONP-formatted string like this:

```json
callback({
   "ranking":[{"id":"url1"}, {"id":"url2"}, {"id":"url3"}],
   "eventId":"<opaque event string>",
   "appId":"<your app id>",
   "actionSets":[{"id":"<A1>","lastRefresh":"2017-04-29T22:34:25.3401438Z"},
                 {"id":"<A2>","lastRefresh":"2017-04-30T22:34:25.3401438Z"}]});
```

The browser then executes this string as a call to `callback()` function.

The parameter to the call-back function in the preceding example has the following schema:

- `ranking` provides the ranking of URLs to be displayed.
- `eventId` is used internally by the Custom Decision Service to match this ranking with the corresponding clicks.
- `appId` allows the callback function to distinguish between multiple applications of Custom Decision Service running on the same webpage.
- `actionSets` element lists each action set used in the Ranking API call, along with the UTC timestamp of the last successful refresh. (Recall that action sets are periodically refreshed via supplied RSS/Atom feeds.) For example, the callback function may need to fall back to their default ranking if some of the action sets are not current.

### Ranking API with parameters

Ranking API allows the following parameters:

- `details=1` and `details=2` insert auxiliary details about each article listed in `ranking`.
- `dnt=1` disables user cookies.

Parameters can be combined in standard query string syntax, for example, `details=2&dnt=1`.

> [!IMPORTANT]
> `dnt=1` should be the default setting in Europe until the end user agrees to the cookie banner.

`details=1` inserts each article's `guid`, if it is served by the Action Set API. Then HTTP response looks like this:

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

`details=2` adds more details that Custom Decision Service may extract from articles' SEO meta-tags:

- `title` from `<meta property="og:title" content="..." />` or `<meta property="twitter:title" content="..." />` or `<title>...</title>`.
- `description` from `<meta property="og:description" ... />`  or `<meta property="twitter:description" content="..." />` or `<meta property="description" content="..." />`.
- `image` from `<meta property="og:image" content="..." />`.
- `ds_id` from `<meta name=”microsoft:ds_id” content="..." />`.


The HTTP response then looks like this:

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

where the `<details>` element is of the form

```json
[{"guid":"123"}, {"description":"some text", "ds_id":"234", "image":"ImageUrl1", "title":"some text"}]
```

## Reward API

Custom Decision Service only uses clicks the top slot (but clicks for all slots are logged). Each click is interpreted as a reward of 1, the lack of a click is interpreted as a reward of 0. Clicks are matched with the corresponding rankings using event ids, which are generated by [Ranking API](#ranking-api) call and passed via session cookies.

The simplest way to report rewards is to insert the following code snippet into each article page:

```html
<script src="https://ds.microsoft.com/DecisionService.js"></script>
<script> window.DecisionService.trackPageView(); </script>
```

(The snippet can go anywhere on the page, but normally it would be in the HTML head.)


> [!IMPORTANT]
> To use this version of the API:
>
> - User cookies must be enabled.
> - The "inferred URL" of an article must match the URL specified by Action Set API.
>
> The "inferred URL" of an article is defined as the "canonical link", whenever specified, and as the URL in the user's browser otherwise.


Otherwise, reward reporting should be implemented differently. The following line should be added on the front page inside the code that handles clicks on the articles:

```javascript
window.DecisionService.trackPageView({'id':'action id'});
```

>[!TIP]
> Both versions of Reward API can be used concurrently. The clicks would not be double-counted.
>
>

> [!TIP]
> For testing only, Reward API can be invoked via Curl:
>
>```sh
>curl -v https://ds.microsoft.com/<appid>/reward/<eventId> -X POST -d 1 -H "Content-Type: application/json
>```
>
> Expected effect is HTTP response 200 (OK). Assuming Azure Storage account key was supplied on the portal, you can see the reward of 1 for this event in the log.

## Action Set API (customer-provided)

On a high level, Action Set API returns a list of articles (a.k.a. "actions"). Each article is specified by a URL of an article and (optionally) article title and publication date. Recall that you can specify multiple action sets on the portal. A different Action Set API should be specified for each action set, as a distinct URL.

Each Action Set API can be implemented in two ways: as an RSS feed or as an Atom feed. Either should conform to the respective standard, and return a correct XML. For RSS, a representative example is as follows:
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

- `<link>` is mandatory, used as action id by Custom Decision Service.
- `<date>` is ignored if <=15 items, mandatory otherwise.
  - If there are >15 items, the 15 most recent ones are used.
  - must be in the standard format for RSS or ATOM, respectively.
    - [RFC 822](https://tools.ietf.org/html/rfc822) for RSS: for example, `"Fri, 28 Apr 2017 18:02:06 GMT"`.
    - [RFC 3339](https://tools.ietf.org/html/rfc3339) for Atom: for example, `"2016-12-19T16:39:57-08:00"`.
- `<title>` is optional, used to generate features that describe the article.
- `<guid>` is optional, passed through the system to the callback function (if the `?details` parameter is specified in the Ranking API call).

Other elements inside an `<item>` are ignored.

The Atom feed version uses the same XML syntax and conventions.

> [!TIP]
> If your system uses its own article ids, they can be passed into the callback function using `<guid>`.

