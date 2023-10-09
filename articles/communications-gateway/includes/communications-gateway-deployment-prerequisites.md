---
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: include
ms.date: 08/23/2022
---

> [!IMPORTANT]
> You must fully understand the onboarding process for your chosen communications service and any dependencies introduced by the onboarding process.
> 
> Allow sufficient elapsed time for the deployment and onboarding process. For example, you might need wait up to two weeks for a new Azure Communications Gateway resource to be provisioned before you can connect it to your network. 

You must own globally routable numbers that you can use for testing, as follows.

|Type of testing|Numbers required |
|---------|---------|
|Automated validation testing by Microsoft Teams test suites|Minimum: 6. Recommended: 9 (to run tests simultaneously).|
|Manual test calls made by you and/or Microsoft staff during integration testing |Minimum: 1|

After deployment, the automated validation testing numbers use synthetic traffic to continuously check the health of your deployment.