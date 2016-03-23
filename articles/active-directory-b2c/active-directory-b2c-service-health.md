<properties
	pageTitle="Azure Active Directory B2C preview: Service health | Microsoft Azure"
	description="Notifications on minor Azure Active Directory B2C issues, status and mitigations"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="bryanla"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/22/2016"
	ms.author="swkrish"/>

# Azure Active Directory B2C preview: Service health

This page provides notifications on minor service issues, status and mitigations. You can bookmark this page for future reference. Continue to monitor the [Azure status dashboard](https://azure.microsoft.com/status/) as well.

### 3/22/2016: SSO bug on B2C tenants

A SSO (Single Sign On) bug was introduced at 1 PM PST on 3/17/2016 and was mitigated at 10 AM PST on 3/18/2016. During this time period, <100 consumers were impacted. We are continuing to monitor this closely. Conditions for your consumer to have experienced this bug:

1. You have setup a sign-in policy with "local accounts" as the sole identity provider configured in it.
2. A consumer signs-in to Azure AD B2C successfully the first time.
3. The consumer tries to sign-in again, but instead of getting SSO, he or she is shown an error message.

The only workaround for the consumer (after Step 3) was to close & re-open the browser and re-authenticate.
