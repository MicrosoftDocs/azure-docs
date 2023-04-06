---
title: Defender for DevOps FAQ
description: If you're having issues with Defender for DevOps perhaps, you can solve it with these frequently asked questions.
ms.topic: reference
ms.date: 02/23/2023
---

# Defender for DevOps frequently asked questions (FAQ)

If you're having issues with Defender for DevOps these frequently asked questions may assist you,

## FAQ

- [I'm getting an error while trying to connect](#im-getting-an-error-while-trying-to-connect)
- [Why can't I find my repository](#why-cant-i-find-my-repository)
- [Secret scan didn't run on my code](#secret-scan-didnt-run-on-my-code)
- [I don’t see generated SARIF file in the path I chose to drop it](#i-dont-see-generated-sarif-file-in-the-path-i-chose-to-drop-it)
- [I don’t see the results for my ADO projects in Microsoft Defender for Cloud](#i-dont-see-the-results-for-my-ado-projects-in-microsoft-defender-for-cloud)
- [Why is my Azure DevOps repository not refreshing to healthy?](#why-is-my-azure-devops-repository-not-refreshing-to-healthy) 
- [I don’t see Recommendations for findings](#i-dont-see-recommendations-for-findings)
- [What information does Defender for DevOps store about me and my enterprise, and where is the data stored and processed?](#what-information-does-defender-for-devops-store-about-me-and-my-enterprise-and-where-is-the-data-stored-and-processed)
- [Why are Delete source code and Write Code permissions required for Azure DevOps?](#why-are-delete-source-and-write-code-permissions-required-for-azure-devops)
- [Is Exemptions capability available and tracked for app sec vulnerability management](#is-exemptions-capability-available-and-tracked-for-app-sec-vulnerability-management)
- [Is continuous, automatic scanning available?](#is-continuous-automatic-scanning-available)
- [Is it possible to block the developers committing code with exposed secrets](#is-it-possible-to-block-the-developers-committing-code-with-exposed-secrets)
- [I'm not able to configure Pull Request Annotations](#im-not-able-to-configure-pull-request-annotations)
- [What programming languages are supported by Defender for DevOps?](#what-programming-languages-are-supported-by-defender-for-devops) 
- [I'm getting an error that informs me that there's no CLI tool](#im-getting-an-error-that-informs-me-that-theres-no-cli-tool)

### I'm getting an error while trying to connect

When you select the *Authorize* button, the account that you're logged in with is used. That account can have the same email but may have a different tenant. Make sure you have the right account/tenant combination selected in the popup consent screen and Visual Studio.

You can [check which account is signed in](https://app.vssps.visualstudio.com/profile/view).

### Why can't I find my repository

The Azure DevOps service only supports `TfsGit`.

Ensure that you've [onboarded your repositories](./quickstart-onboard-devops.md?branch=main) to Microsoft Defender for Cloud. If you still can't see your repository, ensure that you're signed in with the correct Azure DevOps organization user account. Your Azure subscription and Azure DevOps Organization need to be in the same tenant. If the user for the connector is wrong, you need to delete the previously created connector, sign in with the correct user account and re-create the connector.

### Secret scan didn't run on my code 

To ensure your code is scanned for secrets, make sure you've [onboarded your repositories](./quickstart-onboard-devops.md?branch=main) to Defender for Cloud. 

In addition to onboarding resources, you must have the [Microsoft Security DevOps (MSDO) Azure DevOps extension](./azure-devops-extension.md?branch=main) configured for your pipelines. The extension runs secret scan along with other scanners.

If no secrets are identified through scans, the total exposed secret for the resource shows `Healthy` in Defender for Cloud. 

If secret scan isn't enabled (meaning MSDO isn't configured for your pipeline) or a scan isn't performed for at least 14 days, the resource shows as `N/A` in Defender for Cloud.

### I don’t see generated SARIF file in the path I chose to drop it

If you don’t see SARIF file in the expected path, you may have chosen a different drop path than the `CodeAnalysisLogs/msdo.sarif` one. Currently you should drop your SARIF files to `CodeAnalysisLogs/msdo.sarif`.

### I don’t see the results for my ADO projects in Microsoft Defender for Cloud 

Currently, OSS vulnerabilities, IaC scanning vulnerabilities, and Total code scanning vulnerabilities are only available for GitHub repositories. 

Azure DevOps repositories only have the total exposed secrets available and will show `N/A` for all other fields. You can learn more about how to [Review your findings](defender-for-devops-introduction.md).

### Why is my Azure DevOps repository not refreshing to healthy? 

For a previously unhealthy scan result to be healthy again, updated healthy scan results need to be from the same build definition as the one that generated the findings in the first place.  A common scenario where this issue occurs is when testing with different pipelines.  For results to refresh appropriately, scan results need to be for the same pipeline(s) and branch(es). 

If no scan is performed for 14 days, the scan results revert to `N/A`. 

### I don’t see Recommendations for findings

Ensure that you've onboarded the project with the connector and that your repository (that build is for), is onboarded to Microsoft Defender for Cloud. You can learn how to [onboard your DevOps repository](./quickstart-onboard-devops.md?branch=main) to Defender for Cloud. 

You must have more than a [stakeholder license](https://azure.microsoft.com/pricing/details/devops/azure-devops-services/) to the repos to onboard them, and you need to be at least the security reader on the subscription where the connector is created. You can confirm if you've onboarded the repositories by seeing them in the inventory list in Microsoft Defender for Cloud.

### What information does Defender for DevOps store about me and my enterprise, and where is the data stored and processed?

Defender for DevOps connects to your source code management system, for example, Azure DevOps, GitHub, to provide a central console for your DevOps resources and security posture. Defender for DevOps processes and stores the following information:

- Metadata on your connected source code management systems and associated repositories. This data includes user, organizational, and authentication information.

- Scan results for recommendations and assessments results and details.

Data is stored within the region your connector is created in and flows into [Microsoft Defender for Cloud](defender-for-cloud-introduction.md). You should consider which region to create your connector in, for any data residency requirements as you design and create your DevOps connector.

Defender for DevOps currently doesn't process or store your code, build, and audit logs.

Learn more about [Microsoft Privacy Statement](https://go.microsoft.com/fwLink/?LinkID=521839&amp;clcid=0x9).

### Why are Delete Source and Write Code permissions required for Azure DevOps?

Azure DevOps doesn't have the necessary granularity for its permissions. These permissions are required for some of the Defender for DevOps features, such as pull request annotations in order to work.

### Is Exemptions capability available and tracked for app sec vulnerability management?

Exemptions aren't available for Defender for DevOps within Microsoft Defender for Cloud.

### Is continuous, automatic scanning available?

Currently scanning occurs at build time.  

### Is it possible to block the developers committing code with exposed secrets?  

The ability to block developers from committing code with exposed secrets isn't currently available.

### I'm not able to configure Pull Request Annotations

Make sure you have write (owner/contributor) access to the subscription. 

### What programming languages are supported by Defender for DevOps?

The following languages are supported by Defender for DevOps:

- Python
- JavaScript
- TypeScript

### I'm getting an error that informs me that there's no CLI tool

When you run the pipeline in Azure DevOps, you receive the following error: 
`no such file or directory, scandir 'D:\a\_msdo\versions\microsoft.security.devops.cli'`.

:::image type="content" source="media/devops-faq/error-in-run.png" alt-text="Screenshot that shows an error that states there's no CLI tool." lightbox="media/devops-faq/error-in-run.png":::

This error can be seen in the extensions job as well.

:::image type="content" source="media/devops-faq/error-in-job.png" alt-text="Screenshot that shows the job's extension where the error is visible." lightbox="media/devops-faq/error-in-job.png":::

This error occurs if you're missing the dependency of `dotnet6` in the pipeline's YAML file. DotNet6 is required to allow the Microsoft Security DevOps extension to run. Include this as a task in your YAML file to eliminate the error.
 
You can learn more about [Microsoft Security DevOps](https://marketplace.visualstudio.com/items?itemName=ms-securitydevops.microsoft-security-devops-azdevops). 


## Next steps

- [Overview of Defender for DevOps](defender-for-devops-introduction.md)
