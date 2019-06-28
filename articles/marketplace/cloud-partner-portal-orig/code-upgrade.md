---
title: Upgrading code to the latest platform  | Azure Marketplace
description: This topic explains how to upgrade your Microsoft Dynamics 365 for Operations platform version to the latest platform release
services: Azure, Marketplace, Cloud Partner Portal, 
author: pbutlerm
manager: Ricardo.Villalobos 
ms.service: marketplace
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pabutler
---

# Upgrading code to the latest platform

This article explains how to upgrade your Microsoft Dynamics 365 for Operations platform version to the latest platform release.

## Overview

The Microsoft Dynamics 365 for Operations platform consists of the following components:

Dynamics 365 for Operations platform binaries such as Application Object Server (AOS), the data management framework, the reporting and business intelligence (BI) framework, development tools, and analytics services. The following Application Object Tree (AOT) packages:

1. Application Platform
2. Application Foundation
3. Test Essentials

**Important**: To move to the latest Dynamics 365 for Operations platform, your Dynamics 365 for operations implementation cannot have any customizations (overlayering) of any of the AOT packages that belong to the platform. This restriction was introduced in platform update 3, so that seamless continuous updates can be made to the platform. If you are running on a platform that is older than platform update 3, see the Upgrading to platform update 3 from an earlier build section at the end of this article.

For more Info on Code upgrade, Please refer [here](https://docs.microsoft.com/dynamics365/operations/dev-itpro/migration-upgrade/upgrade-latest-platform-update).