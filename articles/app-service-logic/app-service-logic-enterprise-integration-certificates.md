<properties 
	pageTitle="Overview of Enterprise Integration Pack | Microsoft Azure App Service" 
	description="Use the features of Enterprise Integration Pack to enable business process and integration scenarios using Microsoft Azure App service" 
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java"
	authors="msftman" 
	manager="erickre" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2016" 
	ms.author="deonhe"/>

# Certificates

## Overview
Enterprise integration uses certificates to secure B2B communications. 

## What are certificates?
Certificates are digital documents that are used to verify the identity of the participants in electronic communications and to secure the electronic communications as well. 

## Why use certificates?
Sometimes, B2B communications need to be kept confidential. Enterprise integration uses certificates to secure these communications in two ways:
- By encrypting the contents of messages
- By digitally signing messages 

You can use either public or private certificates and these certificates can be stored securely in your Azure subscription. 

## How to create it?
To use a certificate in your enterprise integration apps, you first need to upload it into your integration account. After you upload a certificate, it will be available for you to secure your B2B messages when you define their properties in [agreements](./enterprise-integration-agreements.md). 

You can use two types of certificates in your enterprise integration apps:
- Public certificates, which must be purchased from a certification authority (CA)
- Private certificates, which you can issue yourself; These are sometimes referred to as self-signed certificates.

Here are the detailed steps to upload your certificates into your integration account after you log into the Azure portal:   
1. Select **Browse**  
![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)    
2. Enter **integration** in the filter search box and select **Integration Accounts** from the results list     
 ![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)
3. Select the **integration account** to which you will add the map  
![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)
4.  Select the **Maps** tile  
![](./media/app-service-logic-enterprise-integration-certificates/certificate-1.png)
5. Select the **Add** button in the Maps blade that opens  
![](./media/app-service-logic-enterprise-integration-certificates/certificate-2.png)
6. Enter a **Name** for your certificate, select the certificate type (in this example, I used the public certificate type) then select the folder icon on the right side of the **Certificate** text box. This opens up the file picker which allows you to browse to, and select the certificate file you wish to upload to your integration account. After you've selected the certificate, select **OK** in the file picker. This validates and uploads the certificate to your integration account. Finally, back on the **Add certificate blade**, select the **OK** button.  
![](./media/app-service-logic-enterprise-integration-certificates/certificate-3.png) 
7. Within one minute, you will see a notification that indicates that the certificate upload is complete. 
8. Select the **Certificates tile**. This refreshes the page and you should see the newly added certificate:  
![](./media/app-service-logic-enterprise-integration-certificates/certificate-4.png) 

## Next steps - todo - add links:
- [Create a B2B agreement]()
- [Create an enterprise integration app]()
