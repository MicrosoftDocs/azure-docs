<properties 
	pageTitle="How to restrict access to your content by country" 
	description="When a user requests your content, by default, the content is served regardless of where the user made this request from. In some cases, you may want to restrict access to your content by country. This topic explains how to configure the service to allow or block access by country. " 
	services="cdn" 
	documentationCenter=".net" 
	authors="zhangmanling" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cdn" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/16/2015" 
	ms.author="mazha"/>

#How to restrict access to your content by country
 
 
When a user requests your content, by default, the content is served regardless of where the user made this request from. In some cases, you may want to restrict access to your content by country. This topic explains how to configure the service to allow or block access by country. 

>[AZURE.NOTE]Once the configuration is set up, it will apply to all CDN endpoints in your subscription. 

##Step 1: Define the directory path 

When configuring a country filter, you must specify the relative path to the location to which users will be allowed or denied access. You can apply country filtering for all your files with "/" or selected folders by specifying directory paths. 

Example directory path filter:   
		
	/                                 
	/Photos/
	/Photos/Strasbourg

##Step 2: Define the action: block or allow

**Block**: Users from the specified countries will be denied access to assets requested from that recursive path. If no other country filtering options have been configured for that location, then all other users will be allowed access. 

**Allow**: Only users from the specified countries will be allowed access to assets requested from that recursive path.
	 
##Step 3: Define the countries 

Select the countries that you want to block or allow for the path.

Example: 

The rule of blocking **/Photos/Strasbourg/** will filter files including:

	http://az123456.vo.msecnd.net/Photos/Strasbourg/1000.jpg. 
	http://az123456.vo.msecnd.net/Photos/Strasbourg/Cathedral/1000.jpg. 

##Country codes

The **Country Filtering** feature uses country codes to define the countries from which a request will be allowed or blocked for a secured directory. Currently, the following two country codes are supported "EU" (Europe) and "AP" (Asia/Pacific). However, these country codes cannot be used to allow or block all requests from those regions. Rather, those country codes are applied to requests that originate from IP addresses that are spread out over a region instead of a country. To block or allow access in EU and AP countries, select both the countries and corresponding region EU and AP. 


##Considerations
 
- It may take up to an hour for changes to your country filtering configuration to take effect.
- This feature does not support wildcard characters (e.g., *).
- The country filtering configuration associated with the relative path will be applied recursively to that path.
- Only one rule can be applied to the same relative path (you cannot create multiple country filters that point to the same relative path. However, a folder may have multiple country filters. This is due to the recursive nature of country filters. In other words, a subfolder of a previously configured folder can be assigned a different country filter.
