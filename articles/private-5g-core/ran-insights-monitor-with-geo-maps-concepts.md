---
title: Monitor with geo maps in Azure Portal
description: Learn about geo maps for RAN insights resource 
author: delnas
ms.author: delnas
ms.service: private-5g-core
ms.topic: concept-article 
ms.date: 5/28/2024

---


# Monitor with geo maps in Azure Portal
--------------------------------------------------------------------
Once you have [set up](ran-insights-create-resource.md) your radio access network (RAN) insights resource, you can now view your RAN insights geo gap. Geo maps use Azure Maps to show a graphical display of all access points that are linked to a RAN insights resource along with key [RAN metrics](ran-insights-monitor-with-ran-metrics-concepts.md). They indicate the health condition of access points and let you see the components that are attached to sites.



# Set up geo maps
--------------------------------------------------------------------
Geo maps provide a visual understanding of the user's network by showcasing all access points and their health status. 

To get started, you will need an existing Azure Maps resource or [create](https://learn.microsoft.com/en-gb/azure/azure-maps/quick-demo-map-app#create-an-azure-maps-account) a new one. To create a new Azure Map resource: 
1.	Go to the Azure Marketplace, search for Azure Maps.
1.	Select the Azure Map and click on **Create** to create a new Azure Map account.
1.	On the **Basics** tab use the same subscription and resource group that was used for the RAN insights resource. Enter a name for the Azure Map resource, select the region, and choose the default pricing model. 
    1. Please note there is a nominal [cost](https://azure.microsoft.com/en-us/pricing/details/azure-maps/#pricing) associated with the Azure Map. This cost is approximately $20/month for an active user, but is subject to variation based on usage frequency.
1.	Select **Review and Create**

Once you have your Azure Map resource, you must now connect it to your Mobile Network Resource in order to view the geo map in the RAN insights resource. 
1.	Navigate to your existing Mobile Network Resource
1.	On the **Overview** blade of the Mobile Network Resource select **Modify mobile network** 
    1. :::image type="content" source="media/ran-insights/RAN-Insights-Modify-Network.png" alt-text="Screenshot of the Azure portal showing creating a RAN insight resource on the site resource.":::
3.	In the **Azure map account** section choose your desired Azure Map resource. Note that only the Azure map resource associated with that subscription will appear in this drop down.  
1.	Select **Modify** and wait for the deployment to complete
1.	Navigate to your RAN insights resource 
    1. On your RAN insights resource ensure you have set up all your access points and their latitude, longitude values. You can modify values by selecting the access point resource and pressing the **Modify** button. 
1.	On RAN insights resource **Overview** page and select the **Geo Maps** tab. You should now be able to view the Map with access points. 




## Visualize access points using geo maps 
--------------------------------------------------------------------
You can hover on the access point to see additional information, such as its name, latitude and longitude, availability rate, number of active UEs, and uplink/downlink throughput values. 
    :::image type="content" source="media/ran-insights/RAN-Insights-GeoMaps.png" alt-text="Screenshot of the Azure portal showing creating a RAN insight resource on the site resource.":::

The health status is based on the availability rate metric which is the percent of the time that the access point was available during the last sampling period. It will indicate green if the metric is 100%, red if 0%, and orange if between 0-100%. If this metric is not supported by the RAN vendor, then will show as red in geo maps. If the access point is removed from the network or not receiving data, it will show red in geo maps.
    :::image type="content" source="media/ran-insights/RAN-Insights-GeoMaps-orange.png" alt-text="Screenshot of the Azure portal showing creating a RAN insight resource on the site resource.":::

Please note that all metrics shown are based on current values. To access historical data please refer to the RAN insights overview page monitoring tab or metrics page. 




## Related content
--------------------------------------------------------------------
- [Monitor with RAN metrics](ran-insights-monitor-with-ran-metrics-concepts.md)
- [Monitor with correlated metrics](ran-insights-monitor-with-correlated-metrics-concepts.md)

