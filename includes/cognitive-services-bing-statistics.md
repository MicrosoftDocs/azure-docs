Bing Statistics provides analytics for Bing Search APIs. Analytics includes call volume, top query strings, device types used, and more. To get access to Bing Statistics, enable Bing Statistics in your Bing Search paid subscription. Navigate to your Azure dashboard, select your paid subscription, and click Enable Bing Statistics.


> [!NOTE]
> Bing Statistics is available with paid subscriptions only - it is not available with free trial subscriptions. 

Bing updates analytics data every two to three hours and maintains up to 13 month's worth of history.

## Accessing your analytics

To access your analytics dashboard, go to https://bingstatistics.ai. Enter your subscription key, select a reporting time frame, and select the endpoint you're interested in.

For time frame, you can specify:

- All&mdash;Includes up to 13 month's worth of data
- Past 24 hours&mdash;Includes analytics from the last 24 hours (there's a two to three hour delay)
- Past week&mdash;Includes analytics from the previous seven days
- Past month&mdash;Includes analytics from the previous 30 days
- A custom date range&mdash;Includes analytics from the specified date range if available

Next, select the API endpoint that you want analytics for. The list contains only endpoints for which you have paid subscriptions.

## The dashboard

The dashboard shows charts and graphs of the various analytics available for the selected endpoint. Not all analytics are available for all endpoints. The charts and graphs for each endpoint are static (you may not select the charts and graphs to display). The dashboard shows only charts and graphs for which there's data. For example, if you don't include the User-Agent header in your calls, the dashboard will not include device-related graphs.

The following are the available analytics. Each analytic notes endpoint restrictions. 

- **Call Volume**: Shows the number of calls made during the reporting period. If the reporting period is for a day, the chart shows the number of calls made per hour. Otherwise, the chart shows the number of calls made per day of the reporting period.  
  
-  **Top Queries**: Shows the top queries during the reporting period. You can configure the number of queries shown. For example, you can show the top 25, 50, or 75 queries. Top Queries is not available for the following endpoints:  
  
  - /images/trending
  - /images/details
  - /images/visualsearch
  - /videos/trending
  - /videos/details
  - /news
  - /news/trendingtopics
  - /suggestions  
  
- **Geographic Distribution**: The markets where the results come from. For example, en-us. Bing uses the `mkt` query parameter to determine the market, if specified. Otherwise, Bing uses signals such as the caller's IP address to determine the market.  
  
- **Response Code Distribution**: The HTTP status codes of all calls during the reporting period.  
  
- **Browser Type Distribution**: The types of browsers used by the users.  
  
- **Device Type Distribution**: The types of devices used by the users. For example, desktop, tablet, or mobile. Bing uses the User-Agent header to determine the device's type, if specified.  
  
- **Device Resolution Distribution**: The screen resolution of mobile devices used by the users. Bing uses the User-Agent header to determine the device's resolution, if specified.  
  
- **GET and POST Distribution**: The distribution of HTTP GET and POST calls made during the reporting period.  
  
- **Safe Search Distribution**: The distribution of safe search values. For example, off, moderate, or strict. The `safeSearch` query parameter contains the value, if specified. Otherwise, Bing defaults the value to moderate.  
  
- **Modules Requested Distribution**: The requested insights for /images/details and /videos/details endpoints. For example, if the /images/details call requests similar images, similar products, or shopping sources (see the `modules` query parameter).  
  
- **Category Distribution**: The requested categories of news articles for the /news endpoint. For example, if the call requests sports or entertainment articles (see the `category` query parameter).  


The following shows the analytics that are available for each endpoint.

![Distribution by endpoint support matrix](./media/cognitive-services-bing-statistics/bing-statistics-matrix.PNG)


## Filtering the data

For an endpoint, you can filter the data by time frame and one or more distributions (for example, geographical distribution). By default, the data is filtered only by time frame. To select distribution filters, click on the distribution value in the chart. For example, to filter by one or more query strings, select the string in the Top Queries chart. Or to filter by market, select the market in the Geographic Distribution pie chart. Selected filters are shown in the Selected Filters section of the dashboard. As you add filters, the charts and graphs change to reflect the filtered data. 
