<!-- 
NavPath: Bing Web Search API
LinkLabel: Overview
Weight: 80
url:bing-web-search-api/documentation
-->

# Bing Web Search API

The Bing Web Search API provides a similar (but not exact) experience to Bing.com/Search (overview on [MSDN](https://msdn.microsoft.com/en-us/library/mt711415.aspx)). The Bing Web Search API lets partners send a search query to Bing and get back a list of relevant search results. This includes webpages and may include images, videos, and more.

Typically, you'll call only the Web Search API, but if you need only images, videos or only news, you should call these APIs directly. Because calling the Image, Video, and News APIs directly can negatively impact relevance and performance, you should so only if you need a single type of content.

If you need results from a subset of the Bing APIs, you should call the Web Search API and use the responseFilter query parameter to limit the results to only that content (for example, only Images and News).

Note that the Web Search API may not include all of the same functionality or data that the other APIs provide. For example, the Image API includes query parameters that let you filter the images, but you may not specify the filter parameters when you call the Search API. Also, even though the Web Search API results may not include images, the Image API could return images for the same query.

To get started, read our [Getting Started](https://msdn.microsoft.com/en-US/library/mt712546.aspx) guide, which describes how you can obtain your own subscription keys and start making calls to the API. If you already have a subscription, try our API Testing Console [API Testing Console](https://dev.cognitive.microsoft.com/docs/services/56b43eeccf5ff8098cef3807/operations/56b4447dcf5ff8098cef380d/console) where you can easily craft API requests in a sandbox environment.

For information that shows you how to use the Search API, see [Search Guide](https://msdn.microsoft.com/en-us/library/dn760781(v=bsynd.50).aspx).

For information about the programming elements that you'd use to request and consume the search results, see [Search Reference](https://msdn.microsoft.com/en-us/library/dn760794(v=bsynd.50).aspx). Note that results will include objects defined in the Search Reference section and may include objects defined in each of the other API reference sections (for example, [Image Reference](https://msdn.microsoft.com/en-us/library/dn760791(v=bsynd.50).aspx)), if relevant data exists for each.

For additional guide and reference content that is common to all Bing APIs, such as Paging Results and Error Codes, see [Shared Guides](https://msdn.microsoft.com/en-us/library/mt711404(v=bsynd.50).aspx) and [Shared Reference](https://msdn.microsoft.com/en-us/library/mt711403(v=bsynd.50).aspx).
