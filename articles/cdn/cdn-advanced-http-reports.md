<properties 
	pageTitle="CDN - Advanced HTTP Reports" 
	description="Advanced HTTP reports in Microsoft Azure CDN. These reports provide detailed information on CDN activity." 
	services="cdn" 
	documentationCenter=".NET" 
	authors="camsoper" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cdn" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/31/2015" 
	ms.author="casoper"/>

# Advanced HTTP reports in Microsoft Azure CDN

## Overview

This document explains advanced HTTP reporting in Microsoft Azure CDN. These reports provide detailed information on CDN activity.

> [AZURE.NOTE] Advanced HTTP reports is a feature of the Premium CDN tier.

## Accessing advanced HTTP reports

1. From the CDN profile blade, click the **Manage** button.

	![CDN profile blade manage button](./media/cdn-advanced-http-reports/cdn-manage-btn.png)
	
	The CDN management portal opens.
	
2. Hover over the **Analytics** tab, then hover over the **Advanced HTTP Reports** flyout.  Click on **HTTP Large Platform**.
	
	Report options are displayed.

## Reports

### Geography Reports (Map-Based)

There are five reports that take advantage of a map to indicate the regions from which your content is being requested. These reports are World Map, United States Map, Canada Map, Europe Map, and Asia Pacific Map.

Each map-based report ranks geographic entities (i.e., countries, states, and provinces) according to the percentage of hits that originated from that region. Additionally, a map is provided to help you visualize the locations from which your content is being requested. It is able to do so by color-coding each region according to the amount of demand experienced in that region. Lighter shaded regions indicate lower demand for your content, while darker regions indicate higher levels of demand for your content.

Detailed traffic and bandwidth information for each region is provided directly below the map. This allows you to view the total number of hits, the percentage of hits, the total amount of data transferred (in gigabytes), and the percentage of data transferred for each region. View a description for each of these metrics. Finally, when you hover over a region (i.e., country, state, or province), the name and the percentage of hits that occurred in the region will be displayed as a tooltip.

A brief description is provided below for each type of map-based geography report.

Report Name | Description
------------|------------
World Map | This report allows you to view the worldwide demand for your CDN content. Each country is color-coded on the world map to indicate the percentage of hits that originated from that region.
United States Map | This report allows you to view the demand for your CDN content in the United States. Each state is color-coded on this map to indicate the percentage of hits that originated from that region.
Canada Map | This report allows you to view the demand for your CDN content in Canada. Each province is color-coded on this map to indicate the percentage of hits that originated from that region.
Europe Map | This report allows you to view the demand for your CDN content in Europe. Each country is color-coded on this map to indicate the percentage of hits that originated from that region.
Asia Pacific Map | This report allows you to view the demand for your CDN content in Asia. Each country is color-coded on this map to indicate the percentage of hits that originated from that region. 
