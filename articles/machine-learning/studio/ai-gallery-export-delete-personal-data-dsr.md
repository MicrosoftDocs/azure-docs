---
title: Export and delete in-product user data from Azure AI Gallery | Microsoft Docs
description: In-product data stored by Azure Machine Learning Studio is available for export and deletion through the Azure portal and also through authenticated REST APIs. Telemetry data can be accessed through the Azure Privacy Portal. This article shows you how.
services: machine-learning
author: heatherbshapiro
ms.author: hshapiro
manager: cgronlun
ms.reviewer: jmartens, mldocs
ms.service: machine-learning
ms.component: studio
ms.topic: conceptual
ms.date: 05/25/2018
---

# Export and delete in-product user data from Azure AI Gallery



[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]




Azure AI Gallery
View items published through the Azure AI Gallery website
Users can view both public and unlisted Solutions, Projects, Experiments, and other published items by visiting the Azure AI Gallery website.
1.	Log into https://gallery.cortanaintelligence.com
2.	Click on the profile picture in the top-right corner, then the account name to load the profile page.
3.	The profile page displays all items published to the Gallery, including unlisted entries.

AI Gallery Catalog API
One can programmatically view data collected through the Catalog API, which is accessible at https://catalog.cortanaanalytics.com. To view data, the user will need their Author ID.  To view unlisted entities through the Catalog API, an Access Token will be required
All catalog responses are returned in JSON format.
Getting an Author ID
The Author ID is based on the email address used when publishing to the Azure AI Gallery. It does not change:
1.	Log into https://gallery.cortanaintelligence.com
2.	Click the profile picture in the top-right corner, then click the account name to load the profile page.
3.	The URL in the address bar will display the author id after “authorId=”. For example, if the address bar contains:
https://gallery.cortanaintelligence.com/Home/Author?authorId=CB9AEFCBEB947FD5D25D29A477B9CBC572AAD7BEF3236FF55724282F7C8CE8BE
then the author id is
CB9AEFCBEB947FD5D25D29A477B9CBC572AAD7BEF3236FF55724282F7C8CE8BE

Getting your Access Token
One will need an Access Token to view unlisted entities through the Catalog API. Without an Access Token, users can still view public entities and other user info.

To get an Access Token a user will need to inspect the “DataLabAccessToken” header of an HTTP request the browser makes to the Catalog API while logged in.
1.	Open a browser tab to the profile page by following steps 1 and 2 from “Getting an Author ID”.
2.	Open a “Developer Tools” window by pressing F12, select the Network tab, and refresh the page. Filter requests by the string “catalog” by typing into the Filter textbox.
3.	One should see some requests to the URL “https://catalog.cortanaanalytics.com/entities”. Find a GET request and select the “Headers” tab. Scroll down to the “Request Headers” section.
4.	One should see a header with the name “DataLabAccessToken”. The value of this field is the token. It is not to be shared. 
View user information
To view information in a user’s profile, visit the following URL, replacing [AuthorId] with the Author Id obtained from the previous section.
https://catalog.cortanaanalytics.com/users/[AuthorID]

For example:
https://catalog.cortanaanalytics.com/users/CB9AEFCBEB947FD5D25D29A477B9CBC572AAD7BEF3236FF55724282F7C8CE8BE

Returns a response such as:
{"entities_count":9,"contribution_score":86.351575190956922,"scored_at":"2018-05-07T14:30:25.9305671+00:00","contributed_at":"2018-05-07T14:26:55.0381756+00:00","created_at":"2017-12-15T00:49:15.6733094+00:00","updated_at":"2017-12-15T00:49:15.6733094+00:00","name":"First Last","slugs":["First-Last"],"tenant_id":"14b2744cf8d6418c87ffddc3f3127242","community_id":"9502630827244d60a1214f250e3bbca7","id":"CB9AEFCBEB947FD5D25D29A477B9CBC572AAD7BEF3236FF55724282F7C8CE8BE","_links":{"self":"https://catalog.azureml.net/tenants/14b2744cf8d6418c87ffddc3f3127242/communities/9502630827244d60a1214f250e3bbca7/users/CB9AEFCBEB947FD5D25D29A477B9CBC572AAD7BEF3236FF55724282F7C8CE8BE"},"etag":"\"2100d185-0000-0000-0000-5af063010000\""}
View published entities
The Catalog API stores information about published entities to the Azure AI Gallery. One can also view this information directly on the Gallery website at https://gallery.cortanaintelligence.com. See previous sections for more information.
To view published entities, visit the following URL, replacing [AuthorId] with the Author ID obtained from the previous section.
https://catalog.cortanaanalytics.com/entities?$filter=author/id eq '[AuthorId]'
For example:
https://catalog.cortanaanalytics.com/entities?$filter=author/id eq 'CB9AEFCBEB947FD5D25D29A477B9CBC572AAD7BEF3236FF55724282F7C8CE8BE'

This query will only display public entities. To view all your entities, including unlisted ones, one must provide the Access Token obtained from the previous section.

1.	Using a tool like Postman (https://www.getpostman.com), create an HTTP GET request to the catalog URL as described above.
2.	Create an HTTP request header called “DataLabAccessToken”, with the value set to the Access Token.
3.	Make the HTTP request.

Note: If unlisted entities are not showing up in responses from the Catalog API, the user may have an invalid or expired Access Token. Log out of the Azure AI Gallery, then repeat the steps in “Getting an Access Token” to renew the token.

Links to Public Documentation
Further REST API documentation for Web Services, and Commitment Plan billing is available at: https://docs.microsoft.com/en-us/rest/api/machinelearning/
