---
title: Best practices for adding users to a Face service
titleSuffix: Azure Cognitive Services
description: Learn about the process of Face enrollment to register users in a face recognition service.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: overview
ms.date: 04/19/2021
ms.author: pafarley
---

# Best practices for adding users to a Face service

In order to use the Cognitive Services Face API for face verification or identification, you need to enroll faces into a **LargePersonGroup** or similar data structure. This deep-dive demonstrates best practices for gathering meaningful consent from users and example logic to create high-quality enrollments that will optimize recognition accuracy. 

## Meaningful consent 

One of the key purposes of an enrollment application for facial recognition is to give users the opportunity to consent to the use of images of their face for specific purposes, such as access to a worksite. Because facial recognition technologies may be perceived as collecting sensitive personal data, it's especially important to ask for consent in a way that is both transparent and respectful. Consent is meaningful to users when it empowers them to make the decision that they feel is best for them.   

Based on Microsoft user research, Microsoft's Responsible AI principles, and [external research](ftp://ftp.cs.washington.edu/tr/2000/12/UW-CSE-00-12-02.pdf), we have found that consent is meaningful when it offers the following to users enrolling in the technology:

* Awareness: Users should have no doubt when they are being asked to provide their face template or enrollment photos. 
* Understanding: Users should be able to accurately describe in their own words what they were being asked for, by whom, to what end, and with what assurances. 
* Freedom of choice: Users should not feel coerced or manipulated when choosing whether to consent and enroll in facial recognition. 
* Control: Users should be able to revoke their consent and delete their data at any time. 

This section offers guidance for developing an enrollment application for facial recognition. This guidance has been developed based on Microsoft user research in the context of enrolling individuals in facial recognition for building entry. Therefore, these recommendations might not apply to all facial recognition solutions. Responsible use for Face API depends strongly on the specific context in which it's integrated, so the prioritization and application of these recommendations should be adapted to your scenario. 

> [!NOTE]
> It is your responsibility to align your enrollment application with applicable legal requirements in your jurisdiction and accurately reflect all of your data collection and processing practices.

## Application development 

Before you design an enrollment flow, think about how the application you're building can uphold the promises you make to users about how their data is protected. The following recommendations can help you build an enrollment experience that includes responsible approaches to securing personal data, managing users' privacy, and ensuring that the application is accessible to all users.  

|Category | Recommendations |
|---|---|
|Hardware | Consider the camera quality of the enrollment device. |
|Recommended enrollment features | Include a log-on step with multi-factor authentication. </br></br>Link user information like an alias or identification number with their face template ID from the Face API (known as person ID). This mapping is necessary to retrieve and manage a user's enrollment. Note: person ID should be treated as a secret in the application.</br></br>Set up an automated process to delete all enrollment data, including the face templates and enrollment photos of people who are no longer users of facial recognition technology, such as former employees. </br></br>Avoid auto-enrollment, as it does not give the user the awareness, understanding, freedom of choice, or control that is recommended for obtaining consent. </br></br>Ask users for permission to save the images used for enrollment. This is useful when there is a model update since new enrollment photos will be required to re-enroll in the new model about every 10 months. If the original images aren't saved, users will need to go through the enrollment process from the beginning.</br></br>Allow users to opt out of storing photos in the system. To make the choice clearer, you can add a second consent request screen for saving the enrollment photos. </br></br>If photos are saved, create an automated process to re-enroll all users when there is a model update. Users who saved their enrollment photos will not have to enroll themselves again. </br></br>Create an app feature that allows designated administrators to override certain quality filters if a user has trouble enrolling. |
|Security | Cognitive Services follow [best practices](../cognitive-services-virtual-networks.md?tabs=portal) for encrypting user data at rest and in transit. The following are other practices that can help uphold the security promises you make to users during the enrollment experience. </br></br>Take security measures to ensure that no one has access to the person ID at any point during enrollment. Note: PersonID should be treated as a secret in the enrollment system. </br></br>Use [role-based access control](../../role-based-access-control/overview.md) with Cognitive Services. </br></br>Use token-based authentication and/or shared access signatures (SAS) over keys and secrets to access resources like databases. By using request or SAS tokens, you can grant limited access to data without compromising your account keys, and you can specify an expiry time on the token. </br></br>Never store any secrets, keys, or passwords in your app. |
|User privacy |Provide a range of enrollment options to address different levels of privacy concerns. Do not mandate that people use their personal devices to enroll into a facial recognition system. </br></br>Allow users to re-enroll, revoke consent, and delete data from the enrollment application at any time and for any reason. |
|Accessibility |Follow accessibility standards (for example, [ADA](https://www.ada.gov/regs2010/2010ADAStandards/2010ADAstandards.htm) or [W3C](https://www.w3.org/TR/WCAG21/)) to ensure the application is usable by people with mobility or visual impairments. |

## Next steps  

Follow the [Build an enrollment app](build-enrollment-app.md) guide to get started with a sample enrollment app. Then customize it or write your own app to suit the needs of your product.