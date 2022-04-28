## Connect your GitHub repositories to Microsoft Defender for Cloud 

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same. 

Microsoft Defender for Cloud protects workloads in GitHub. To protect your GitHub-based resources, you can connect an account.

-   **Environment settings page (in Preview)** - This Preview page provides a greatly improved and simpler onboarding experience (including auto provisioning). This mechanism also extends Defender for Cloud\'s enhanced security features to your GitHub resources:

    -   **Defender for Cloud\'s CSPM features** extend to your GitHub resources. This feature assesses your GitHub resources according to GitHub-specific security recommendations, which are also included in your secure score. The resources will also be assessed for compliance with built-in standards specific to DevOps. Defender for Cloud\'s [asset inventory page](https://docs.microsoft.com/en-us/azure/defender-for-cloud/asset-inventory) is a multi-cloud enabled feature helping you manage your GitHub resources alongside your Azure resources.

    -   **Microsoft Defender for DevOps** extends Defender for Cloud's threat detection capabilities and advanced defenses to your GitHub resources.

For a reference list of all the recommendations Defender for Cloud can provide for GitHub resources, see [Reference list of DevOps recommendations](#reference-list-of-recommendations).

### Availability


| Aspect | Details |
|---------------------------|-----------------------------|
| Release state:   | Preview <br> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.                     |
| Pricing:   | The Defender for DevOps plan is free during the Preview. After which, it will be billed. Pricing to be determined at a later date. <br><br> GitHub Advanced Security is a paid service and will be billed through your GitHub Enterprise Account           |
| Required roles and permissions:   | **Contributor** on the relevant Azure subscription <br> **Security Admin Role** in Defender for Cloud <br> GitHub Organization Administrator                       |
| Clouds:    | ![](./media/quickstart-onboard-github/image005.png) Commercial clouds <br> ![](./media/quickstart-onboard-github/image006.png) National (Azure Government, Azure China 21Vianet)                       |

*Prerequisite: to connect a GitHub account to your Azure subscription, you\'ll need access to a GitHub Enterprise account or a public repository with GitHub Advanced Security enabled.*

### Connect your GitHub account

Follow the steps below to create your GitHub connector.

1.  Login to the [Azure portal](https://portal.azure.com/)

    Open **Microsoft Defender for Cloud**

2.  Click **Environment Settings**

![Graphical user interface, text, application, email Description
automatically generated](./media/quickstart-onboard-github/image008.png)

3.  Click **Add environment**


4.  Click on **GitHub**

![Graphical user interface, text, application, email Description
automatically generated](./media/quickstart-onboard-github/image011.png)

5.  Choose a subscription and fill in the **Name**

    Choose a **region (Central US)**, **subscription**, and **resource group**

![Graphical user interface, text, application Description automatically
generated](./media/quickstart-onboard-github/image012.png)

>*Note: This Subscription will be the location where Defender for DevOps will create and store the connection and GitHub resources.*

6.  Click **Next: Select plans** (for Preview this will be greyed out)

![Graphical user interface, text, application, email Description
automatically generated](./media/quickstart-onboard-github/image013.png)

7.  Click **Next: Authorize connection**

8.  Click **Authorize** to grant access for Azure to access your GitHub repositories. Login if required with an account that has permissions to the repositories you want to protect

     Click **Install** and choose the repositories to install the GitHub app

![Graphical user interface Description automatically generated with
medium confidence](./media/quickstart-onboard-github/image014.png)

>*Note: This will install the Defender for DevOps App on the selected repositories which will grant Defender for DevOps access to the repositories.*

9.  Click **Next : Review and create**

10. Click **Create**

    The GitHub connector should look like the following screenshot when completed:

![Graphical user interface, text, application, email Description
automatically generated](./media/quickstart-onboard-github/image015.png)

The Defender for DevOps service will now start discovering your repositories and analyzing any security issues. Once discovered, the Inventory blade will show the repositories and the Recommendations blade will show any security issues related to a repository.
