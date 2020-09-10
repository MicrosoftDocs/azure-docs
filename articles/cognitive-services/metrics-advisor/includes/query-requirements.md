Within the query a **@StartTime** parameter is available to help get metric data of particular timestamp, which will be replaced with a 'yyyy-MM-ddTHH:mm:ss' format string in script. 

> [!IMPORTANT]
> Make sure only metric data on **one single timestamp** will be returned from the query. Metrics Advisor will run the query multiple times against every timestamp to get corresponding metric data. For example, if it's a daily metric, data returned should only contain one single timestamp like '2020-06-21T00:00:00Z' by running the query once 
