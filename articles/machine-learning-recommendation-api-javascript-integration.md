<properties title="Azure Machine Learning Recommendations - JavaScript Integration" pageTitle="Azure Machine Learning Recommendations - JavaScript Integration" description="Azure Machine Learning Recommendations - JavaScript Integration – documentation" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="AharonGumnik" manager="paulettm" editor="cgronlun" videoId="" scriptId="" />

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/30/2014" ms.author="AharonGumnik" />

# Azure Machine Learning Recommendations - JavaScript Integration

This document depict how to integrate your site using JavaScript. The JavaScript enables you to send Data Acquisition events and to consume recommendations once you build a recommendation model. All operations done via JS can be also done from server side.

##Contents

- [1. General Overview](#1-general-overview)
- [2. Prerequisites](#2-prerequisites)
- [3. Send Data Acquisition events using JavaScript](#3-send-data-acquisition-events-using-javascript)
	- [3.1. Browser Support](#31-browser-support)
	- [3.2. Type of Events](#32-type-of-events)
		- [3.2.1. Click Event](#321-click-event)
		- [3.2.2. Recommendation Click Event](#322-recommendation-click-event)
		- [3.2.3. Add Shopping Cart Event](#323-add-shopping-cart-event)
		- [3.2.4. Remove Shopping Cart Event](#324-remove-shopping-cart-event)
		- [3.2.5. Purchase Event](#325-purchase-event)
		- [3.2.6. User Login Event](#326-user-login-event)
- [4. Consume Recommendations via JavaScript](#4-consume-recommendations-via-javascript)
	- [4.1. Consume I2I Recommendations](#41-consume-i2i-recommendations)

##1. General Overview
Integrating your site with Azure ML Recommendations consist on 2 Phases:

1.	Send Events into Azure ML Recommendations. This will enable to build a recommendation model.
2.	Consume the recommendations. After the model is built you can consume the recommendations. (This document does not explain how to build a model, read the quick start guide to get more information on how).


<ins>Phase I</ins>

In the first phase you insert into your html pages a small JavaScript library that enables the page to send events as they occur on the html page into Azure ML Recommendations servers (via Data Market):

![Drawing1][1]

<ins>Phase II</ins>

In the second phase when you want to show the recommendations on the page you select one of the following options:

1.Your server (on the phase of page rendering) calls Azure ML Recommendations Server (via Data Market) to get recommendations. The results include a list of items id. Your server needs to enrich the results with the items Meta data (e.g. images, description) and send the created page to the browser.

![Drawing2][2]

2.The other option is to use the small JavaScript file from phase one to get a simple list of recommended items. The data received here is leaner than the one in the first option.

![Drawing3][3]

##2. Prerequisites

1. Create a new model using the APIs. See the Quick start guide on how to do it.
2. Encode your &lt;dataMarketUser&gt;:&lt;dataMarketKey&gt; with base64. (This will be used for the basic authentication to enable the JS code to call the APIs).


##3. Send Data Acquisition events using JavaScript
The following steps facilitate sending events:

1.	Include JQuery library.

		<script src="http://msraas.cloudapp.net:8080/scripts/jquery-1.8.2.min.js"></script>
2.	Include the JS code on your page.

3.	Initialize Azure ML Recommendations library with the appropriate parameters.

		<script>
			CloudMLRecommendationsStart("<base64encoding of username:key>",
			"<model_id>");
		</script>

4.	Send the appropriate event. See detailed section below on all type of events (example of click event)

		<script>
			if (typeof CloudMLRecommendationsEvent=="undefined { 		
        	        	CloudMLRecommendationsEvent = [];
	                }
			CloudMLRecommendationsEvent.push({ event: "click", item: "18321116" });
		</script>


###3.1.	Browser Support
The library supports IE10+ and Chrome.

###3.2.	Type of Events
There are 5 types of event that the library supports: Click, Recommendation Click, Add to Shop Cart, Remove from Shop Cart and Purchase. There is an additional event that is used to set the user context called Login.

####3.2.1. Click Event
This event should be used any time a user clicked on an item. Usually when user clicks on an item a new page is opened with the item details; in this page this event should be triggered.

Parameters:
- event (string, mandatory) – “click”
- item (string, mandatory) – Unique identifier of the item
- itemName (string, optional) – the name of the item
- itemDescription (string, optional) – the description of the item
- itemCategory (string, optional) – the category of the item
		
		<script>
			if (typeof CloudMLRecommendationsEvent == "undefined") { CloudMLRecommendationsEvent = []; }
			CloudMLRecommendationsEvent.push({ event: "click", item: "3111718" });
		</script>

Or with optional data:

		<script>
			if (typeof CloudMLRecommendationsEvent === "undefined") { CloudMLRecommendationsEvent = []; }
			CloudMLRecommendationsEvent.push({event: "click", item: "3111718", itemName: "Plane", itemDescription: "It is a big plane", itemCategory: "Aviation"});
		</script>


####3.2.2. Recommendation Click Event
This event should be used any time a user clicked on an item that was received from Azure ML Recommendations as a recommended item. Usually when user clicks on an item a new page is opened with the item details; in this page this event should be triggered.

Parameters:
- event (string, mandatory) – “recommendationclick”
- item (string, mandatory) – Unique identifier of the item
- itemName (string, optional) – the name of the item
- itemDescription (string, optional) – the description of the item
- itemCategory (string, optional) – the category of the item
- seeds (string array, optional) – the seeds that generated the recommendation query.
- recoList (string array, optional) – the result of the recommendation request that generated the item that was clicked.
		
		<script>
			if (typeof CloudMLRecommendationsEvent=="undefined") { CloudMLRecommendationsEvent = []; }
			CloudMLRecommendationsEvent.push({event: "recommendationclick", item: "18899918" });
		</script>

Or with optional data:

		<script>
			if (typeof CloudMLRecommendationsEvent == "undefined") { CloudMLRecommendationsEvent = []; }
			CloudMLRecommendationsEvent.push({ event: eventName, item: "198", itemName: "Plane2", itemDescription: "It is a big plane2", itemCategory: "Default2", seeds: ["Seed1", "Seed2"], recoList: ["199", "198", "197"] 				});
		</script>


####3.2.3. Add Shopping Cart Event
This event should be used when the user add an item to the shopping cart.
Parameters:
* event (string, mandatory) – “addshopcart”
* item (string, mandatory) – Unique identifier of the item
* itemName (string, optional) – the name of the item
* itemDescription (string, optional) – the description of the item
* itemCategory (string, optional) – the category of the item
		
		<script>
			if (typeof CloudMLRecommendationsEvent == "undefined") { CloudMLRecommendationsEvent = []; }
			CloudMLRecommendationsEvent.push({event: "addshopcart", item: "13221118" });
		</script>

####3.2.4. Remove Shopping Cart Event
This event should be used when the user removes an item to the shopping cart.

Parameters:
* event (string, mandatory) – “removeshopcart”
* item (string, mandatory) – Unique identifier of the item
* itemName (string, optional) – the name of the item
* itemDescription (string, optional) – the description of the item
* itemCategory (string, optional) – the category of the item
		
		<script>
			if (typeof CloudMLRecommendationsEvent=="undefined") { CloudMLRecommendationsEvent = []; }
			CloudMLRecommendationsEvent.push({ event: "removeshopcart", item: "111118" });
		</script>

####3.2.5. Purchase Event
This event should be used when the user purchased his shopping cart.

Parameters:
* event (string) – “purchase”
* items ( Purchased[] ) – Array holding an entry for each item purchased.<br><br>
Purchased format:
	* item (string) - Unique identifier of the item.
	* count (int or string) – number of items that were purchased.
	* price (float or string) – optional field – the price of the item.

The example below shows purchase of 3 items (33, 34, 35), two with all fields populated (item, count, price) and one (item 34) without a price.

		<script>
			if ( typeof CloudMLRecommendationsEvent == "undefined"){ CloudMLRecommendationsEvent = []; }
			CloudMLRecommendationsEvent.push({ event: "purchase", items: [{ item: "33", count: "1", price: "10" }, { item: "34", count: "2" }, { item: "35", count: "1", price: "210" }] });
		</script>

####3.2.6. User Login Event
Azure ML Recommendations Event library creates and use a cookie in order to identify events that came from the same browser. In order to improve the model results Azure ML Recommendations enables to set a user unique identification that will override the cookie usage.

This event should be used after the user login to your site.

Parameters:
* event (string) – “userlogin”
* user (string) – unique identification of the user.
		<script>
			if (typeof CloudMLRecommendationsEvent=="undefined") { CloudMLRecommendationsEvent = []; }
			CloudMLRecommendationsEvent.push({event: "userlogin", user: “ABCD10AA” });
		</script>

##4. Consume Recommendations via JavaScript
The code that consumes the recommendation is triggered by some JavaScript event by the client’s webpage. The recommendation response includes the recommended items Ids, their names and their ratings. It’s best to use this option only for a list display of the recommended items – more complex handling (such as adding the item’s metadata) should be done on the server side integration.

###4.1 Consume I2I Recommendations
To consume recommendations you need to include the required JavaScript libraries in your page and to call CloudMLRecommendationsStart. See section 2.

To consume recommendations for a single item you need to call a method called: CloudMLRecommendationsGetI2IRecommendation

In Parameters:
* items (list strings separated by comma) – One or more items to get recommendations for.
* numberOfResults (int) – number of required results.
* includeMetadata (boolean, optional) – if set to ‘true’ indicates that the metadata field must be populated in the result.
* Processing function – a function that will handle the recommendations returned. The data is returned as an array of:
	* Item – item unique id
	* name – item name (if exist in catalog)
	* rating – recommendation rating
	* metadata – a string that represents the metadata of the item

Example: The following code requests 8 recommendations for item "64f6eb0d-947a-4c18-a16c-888da9e228ba" (and by not specifying includeMetadata – it implicitly says that no metadata is required), it then concatenate the results into a buffer.

		<script>
 			var reco = CloudMLRecommendationsGetI2IRecommendation("64f6eb0d-947a-4c18-a16c-888da9e228ba", 8, function (reco) {
 				var buff = "";
 				for (var ii = 0; ii < reco.length; ii++) {
   					buff += reco[ii].item + "," + reco[ii].name + "," + reco[ii].rating + "\n";
 				}
 				alert(buff);
			});
		</script>


[1]: ./media/machine-learning-recommendation-api-javascript-integration/Drawing1.png
[2]: ./media/machine-learning-recommendation-api-javascript-integration/Drawing2.png
[3]: ./media/machine-learning-recommendation-api-javascript-integration/Drawing3.png
