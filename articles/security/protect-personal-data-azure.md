---
title: Protect personal data in Microsoft Azure | Microsoft Docs
description: First article in a series of articles to help you use Azure to protect personal data
services: security
documentationcenter: na
author: Barclayn
manager: MBaldwin
editor: TomSh

ms.assetid: 
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/22/2017
ms.author: barclayn
ms.custom: 

---
# Protect personal data in Microsoft Azure

This article introduces a series of articles that help you use Azure security technologies and services to protect personal data. This is a key requirement for many corporate and industry compliance and governance initiatives. The scenario, problem statement and company goals are included here.

## Scenario and problem statement

A large cruise company, headquartered in the United States, is expanding its operations to offer itineraries in the Mediterranean, Adriatic, and Baltic seas, as well as the British Isles. To support those efforts, it has acquired several smaller cruise lines based in Italy, Germany, Denmark and the U.K.

The company uses Microsoft Azure to store corporate data in the cloud. This may include customer and/or employee information such as:

- addresses
- phone numbers
- tax identification numbers
- credit card information

The company must protect the privacy of customer and employee data while making data accessible to those departments that need it. (such as payroll and reservations departments)

## Company goals 

- Data sources that contain personal data are encrypted when residing in cloud storage.

- Personal data that is transferred from one location to another is encrypted while in-transit. This is true if the data is traveling across the virtual network or across the Internet between the corporate datacenter and the Azure cloud.

- Confidentiality and integrity of personal data is protected from unauthorized access by strong identity management and access control technologies.

- Personal data is protected from exposure via data breach via monitoring for vulnerabilities and threats.

- The security state of Azure services that store or transmit personal data is assessed to identify opportunities to better protect personal data.

## Data protection guidance

The following articles contain technical how-to guidance that will help you
attain the personal data protection goals listed above:

- [Azure encryption technologies](protect-personal-data-at-rest.md)

- [Azure encryption technologies](protect-personal-data-in-transit-encryption.md)

- [Azure identity and access technologies](protect-personal-data-identity-access-controls.md)

- [Azure network security technologies](protect-personal-data-network-security.md)

- [Azure Security Center](protect-personal-data-azure-security-center.md)



## Next steps

- [Azure Security Information Site](https://aka.ms/AzureSecInfo)

- [Microsoft Trust Center](https://www.microsoft.com/TrustCenter/default.aspx)

- [Azure Security Center](https://azure.microsoft.com/services/security-center/)

- [Azure Security Team Blog](https://www.azuresecurityorg)

- [Azure.com Blog - Security](https://azure.microsoft.com/blog/topics/security/)
