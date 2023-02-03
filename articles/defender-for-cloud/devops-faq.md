---
title: Defender for DevOps FAQ
description: If you're having issues with Defender for DevOps perhaps, you can solve it with these frequently asked questions.
ms.topic: reference
ms.date: 01/26/2023
---

# Defender for DevOps frequently asked questions (FAQ)

If you're having issues with Defender for DevOps these frequently asked questions may assist you,

## FAQ

- [I'm getting an error while trying to connect](#im-getting-an-error-while-trying-to-connect)
- [Why can't I find my repository](#why-cant-i-find-my-repository)
- [Secret scan didn't run on my code](#secret-scan-didnt-run-on-my-code)
- [I don’t see generated SARIF file in the path I chose to drop it](#i-dont-see-generated-sarif-file-in-the-path-i-chose-to-drop-it)
- [I don’t see the results for my ADO projects in Microsoft Defender for Cloud](#i-dont-see-the-results-for-my-ado-projects-in-microsoft-defender-for-cloud)
- [I don’t see Recommendations for findings](#i-dont-see-recommendations-for-findings)
- [What information does Defender for DevOps store about me and my enterprise, and where is the data stored?](#what-information-does-defender-for-devops-store-about-me-and-my-enterprise-and-where-is-the-data-stored)
- [Is Exemptions capability available and tracked for app sec vulnerability management](#is-exemptions-capability-available-and-tracked-for-app-sec-vulnerability-management)
- [Is continuous, automatic scanning available today](#is-continuous-automatic-scanning-available-today)
- [Is it possible to block the developers committing code with exposed secrets](#is-it-possible-to-block-the-developers-committing-code-with-exposed-secrets)
- [I am not able to configure Pull Request Annotations](#i-am-not-able-to-configure-pull-request-annotations)


### I'm getting an error while trying to connect

When selecting the *Authorize* button, the presently signed-in account is used, which could be the same email but different tenant. Make sure you have the right account/tenant combination selected in the popup consent screen and Visual Studio.

The presently signed-in account can be checked [here](https://app.vssps.visualstudio.com/profile/view).

### Why can't I find my repository

Only TfsGit is supported on Azure DevOps service.

Ensure that you've [onboarded your repositories](/azure/defender-for-cloud/quickstart-onboard-devops?branch=main) to Microsoft Defender for Cloud. If you still can't see your repository, ensure that you're signed in with the correct Azure DevOps organization user account. Your Azure subscription and Azure DevOps Organization need to be in the same tenant. If the user for the connector is wrong, you need to delete the connector that was created, sign in with the correct user account and re-create the connector.

### Secret scan didn't run on my code 

To ensure your code is scanned for secrets, make sure you've [onboarded your repositories](/azure/defender-for-cloud/quickstart-onboard-devops?branch=main) to Defender for Cloud. 

In addition to onboarding resources, you must have the [Microsoft Security DevOps (MSDO) Azure DevOps extension](/azure/defender-for-cloud/azure-devops-extension?branch=main) configured for your pipelines. The extension runs secret scan along with other scanners.

If no secrets are identified through scans, the total exposed secret for the resource shows `Healthy` in Microsoft Defender for Cloud. If secret scan isn't enabled (meaning MSDO isn't configured for your pipeline) or no scanning is performed for at least 14 days, the resource shows as `N/A` in Defender for Cloud.

### I don’t see generated SARIF file in the path I chose to drop it

If you don’t see SARIF file in the expected path, you may have chosen a different drop path than the `CodeAnalysisLogs/msdo.sarif` one. Currently you should drop your SARIF files to `CodeAnalysisLogs/msdo.sarif`.

### I don’t see the results for my ADO projects in Microsoft Defender for Cloud 

Currently, OSS vulnerabilities, IaC scanning vulnerabilities, and Total code scanning vulnerabilities are only available for GitHub repositories. 

Azure DevOps repositories only have the total exposed secrets available and will show `N/A` for all other fields. You can learn more about how to [Review your findings](defender-for-devops-introduction.md).

### I don’t see Recommendations for findings

Ensure that you've onboarded the project with the connector and that your repository (that build is for), is onboarded to Microsoft Defender for Cloud. You can learn how to [onboard your DevOps repository](/azure/defender-for-cloud/quickstart-onboard-devops?branch=main) to Defender for Cloud. 

You must have more than a [stakeholder license](https://azure.microsoft.com/pricing/details/devops/azure-devops-services/) to the repos to onboard them, and you need to be at least the security reader on the subscription where the connector is created. You can confirm if you've onboarded the repositories by seeing them in the inventory list in Microsoft Defender for Cloud.

### What information does Defender for DevOps store about me and my enterprise, and where is the data stored?

Data Defender for DevOps connects to your source code management system, for example, Azure DevOps, GitHub, to provide a central console for your DevOps resources and security posture. Defender for DevOps processes and stores the following information:

- Metadata on your connected source code management systems and associated repositories. This data includes user, organizational, and authentication information.

- Scan results for recommendations and assessments results and details.

Data is stored within the region your connector is created in. You should consider which region to create your connector in, for any data residency requirements as you design and create your DevOps connector.

Defender for DevOps currently doesn't process or store your code, build, and audit logs.

### Is Exemptions capability available and tracked for app sec vulnerability management?

Exemptions are not available yet for Defender for DevOps within Microsoft Defender for Cloud. But they will be trackable when supported.

### Is continuous, automatic scanning available today?

Asynchronous scanning is on the roadmap. Currently scanning occurs at build time.  

### Is it possible to block the developers committing code with exposed secrets?  

Block ability for exposes secrets in on the roadmap.

### I am not able to configure Pull Request Annotations

Make sure you have write (owner/contributor) access to the subscription. 


## Next steps

- [Overview of Defender for DevOps](defender-for-devops-introduction.md)
