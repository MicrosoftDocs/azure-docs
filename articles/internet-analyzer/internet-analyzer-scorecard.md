---
title: 'Interpreting your Scorecard | Microsoft Docs'
description: The FAQ for Azure Internet Analyzer. 
services: internet-analyzer
author: megan-beatty; mattcalder; diego-perez-botero

ms.service: internet-analyzer
ms.topic: guide
ms.date: 10/16/2019
ms.author: mebeatty
---
# Interpreting your scorecard

The scorecard tab contains the aggregated and analyzed results from your tests. Each test has its own scorecards. Scorecards provide quick and meaningful summaries of measurement results to provide data-driven results for your networking requirements. Internet Analyzer takes care of the analysis, allowing you to focus on the decision. 

The scorecard tab can be found in the Internet Analyzer resource menu. 


## Filters

* ***Test:*** Select the test that you’d like to view results for - each test has its own scorecard. Test data will appear once there is enough data to complete the analysis – in most cases, this should be within 24 hours. 
* ***Time period & end date:*** Three scorecards are generated daily – each scorecard reflects a different aggregation period – the 24 hours prior (day), the seven days prior (week), and the 30 days prior (month). Use the “End Date” filter to select the last day of the time period you want to see. 
* ***Country:*** For each country that you have end users, a scorecard is generated. The global filter is representative of all your end users.  

## Measurement Count

The number of measurements impacts the confidence of the analysis. The higher the count, the more accurate the result. Tests should aim for a minimum of 100 measurements per endpoint per day. For meaningful analysis, the measurement count for endpoints A and B should be similar. If not, the results should not be trusted.

## Percentiles

Latency, measured in milliseconds, is a popular metric for measuring speed between a source and destination on the Internet. Latency data is not normally distributed (that is, does not follow a "Bell Curve") meaning there is a "long-tail" of large latency values that skew results when summarizing results when using statistics such as the arithmetic mean. As an alternative, percentiles provide a common "distribution-free" way to analyze data. As an example, the median, or P50, summarizes the value of the middle of the distribution- half the values are above it and half are below it. A P75 value means that 75% of values observed are less than the P75 value.

For analysis purposes, P50 (median), is useful as an expected value for a latency distribution. Higher percentiles, such as P90, are useful for identifying how high latency is in the worst case. If you are concerned with improving latency in general, P50 is a useful metric to focus on. If you are focused on improving performance for the worst-performing customers, then P90 should be the focus.

A percentile computed by Internet Analyzer is a sample metric as compared to a hypothetical true population metric. For example, the daily true population median latency between students at the University of Southern California and Microsoft is the median latency value of all requests during that day. In practice, measuring the value of all requests is impractical, so we assume that a sample is representative of the true population.

## Deltas

Deltas are the difference in metrics values for endpoints A and B. Deltas may be absolute (for example, 10 milliseconds) or relative (5%). 

## Confidence Interval 

Confidence intervals (CI) are a range of values, which have a probability of containing a population point metric such as median, P75, or average. A common statistical convention is to use the 95% CI. We choose confidence intervals in place of p-values, which are known to be subject to misinterpretation.

For Internet Analyzer, a narrow confidence interval is good in that it means we are 95% sure that the interval contains the population metric such as P50 or P90. A wide confidence interval means less certainty about our sample metric.

## Time Series 

A time series is useful for showing how a metric changes over time. On the Internet, there are many factors that cause time of day effects and seasonality such as business-hours (for example, 9am-5pm), weekday-weekend differences, and holidays. Time of day effects will differ depending on the nature of the business between end users and the application but is useful to understand when users are most active.


## Next Steps

To learn more, see our [Internet Analyzer Overview](internet-analyzer-overview.md).
