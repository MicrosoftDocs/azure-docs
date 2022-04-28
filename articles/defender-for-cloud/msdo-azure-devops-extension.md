## How-to Guide: Microsoft Security DevOps Azure DevOps Extension

Microsoft Security DevOps (MSDO) is a command line application that integrates static analysis tools into the development lifecycle. MSDO installs, configures, and runs the latest versions of static analysis tools (including, but not limited to, SDL/security and compliance tools). MSDO is data-driven with portable configurations that enable deterministic execution across multiple environments.

The MSDO leverages the following Open Source tools:
|  Name  |  Language   |  License  |
|----------------|-------|---------|
|[Bandit](https://github.com/PyCQA/bandit) | Python  | [Apache License 2.0](https://github.com/PyCQA/bandit/blob/master/LICENSE) |
|[BinSkim](https://github.com/Microsoft/binskim) | Binary -- Windows, ELF  | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE)|
|[ESlint](https://github.com/eslint/eslint)  |  Javascript |  [MIT License](https://github.com/eslint/eslint/blob/main/LICENSE)  |
|[Credscan](https://secdevtools.azurewebsites.net/helpcredscan.html)   |   Credential Scanner (aka CredScan) is a tool developed and maintained by Microsoft to identify credential leaks such as those in source code and configuration files <br> common types: defaul passwords, SQL connection strings, Certificates with private keys | Not Open Source
|[Template Analyzer](https://github.com/Azure/template-analyzer) |  ARM template | [MIT License](https://github.com/Azure/template-analyzer/blob/main/LICENSE.txt)
|[Terrascan](https://github.com/accurics/terrascan) | Terraform (HCL2), Kubernetes (JSON/YAML), Helm v3, Kustomize, Dockerfiles, Cloud Formation | [Apache License 2.0](https://github.com/accurics/terrascan/blob/master/LICENSE)
|[Trivy](https://github.com/aquasecurity/trivy) | container images, file systems, git repositories | [Apache License 2.0](https://github.com/aquasecurity/trivy/blob/main/LICENSE)


*Prerequisite: During Preview, access to the Extension must be granted to your Azure DevOps Organization. Contact the Preview Team to request access.*

*Prerequisite: Admin privileges to the Azure DevOps organization are required to install the extension. If you don\'t have access to install the extension, request access from your Azure DevOps organization Admin during the installation process.*

### Steps: Configure the Extension

1.  Sign into [Azure DevOps](https://dev.azure.com/)

2.  Click on the **Shopping Bag icon** at the top right

    Click on **Manage extensions**

![Graphical user interface, application, Teams Description automatically
generated](./media/msdo-azure-devops-extension/image039.png)

3.  If the Microsoft Security DevOps Extension is listed in the Installed tab move to the next step

    If not, click on the **Shared** tab

![Graphical user interface, application Description automatically
generated](./media/msdo-azure-devops-extension/image040.png)

4.  Select the Microsoft Security DevOps Extension

    Click **Install**

> ![Graphical user interface, text, application, email Description
> automatically
> generated](./media/msdo-azure-devops-extension/image041.png)

5.  On the Extension installation page, Select the appropriate Organization from the dropdown menu, click **Install**

![Graphical user interface, text, application Description automatically
generated](./media/msdo-azure-devops-extension/image042.png)

6.  Click **Proceed to organization**

![Graphical user interface, application Description automatically
generated](./media/msdo-azure-devops-extension/image043.png)

### Steps: Configure using YAML Pipelines

1.  Select a Project

2.  Click **Pipelines**

    Click **Create Pipeline**

![Graphical user interface, text, application Description automatically
generated](./media/msdo-azure-devops-extension/image044.png)

3.  Click **Azure Repos Git**

![Graphical user interface, text, application Description automatically
generated](./media/msdo-azure-devops-extension/image045.png)

4.  Select a repository

![Graphical user interface, application, Teams Description automatically
generated](./media/msdo-azure-devops-extension/image046.png)

5.  Click **Starter pipeline**

![Graphical user interface, text, application Description automatically
generated](./media/msdo-azure-devops-extension/image047.png)

6.  Cut and paste the following YAML into the pipeline

```
# Starter pipeline
# Start with a minimal pipeline that you can customize to build and deploy your code.
# Add steps that build, run tests, deploy, and more
# https://aka.ms/yaml
trigger:
- main
pool:
vmImage: windows-latest
steps:
- task: UseDotNet@2
displayName: \'Use dotnet\'
inputs:
version: 3.1.x
- task: UseDotNet@2
displayName: \'Use dotnet\'
inputs:
version: 5.0.x
- task: UseDotNet@2
displayName: \'Use dotnet\'
inputs:
version: 6.0.x
- task: MicrosoftSecurityDevOps@1
displayName: \'Microsoft Security DevOps\'
```

7.  Click **Save and run**

    Click **Save and run** to Commit the pipeline

![Graphical user interface, text, application, email Description
automatically generated](./media/msdo-azure-devops-extension/image048.png)

>*It will take a few minutes to run pipelines and save the results. To make viewing the scan results easier, you can install this free extension in your Azure DevOps organization: [SARIF SAST Scans Tab - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=sariftools.scans)*

### Steps: Configure using Azure DevOps Pipeline Classic Editor

1.  Select a Project

2.  Click **Pipelines**

    Click **Create Pipeline**

![Graphical user interface, text, application Description automatically
generated](./media/msdo-azure-devops-extension/image049.png)

3.  Click **Use the classic editor to create a pipeline without YAML**

![Graphical user interface, text, application, email Description
automatically generated](./media/msdo-azure-devops-extension/image050.png)

4.  Select a source, Team project, Repository, and Default branch from the dropdown menus

    Click **Continue**

![Graphical user interface, application Description automatically
generated](./media/msdo-azure-devops-extension/image051.png)

5.  Click **Empty job**

![Graphical user interface, application Description automatically
generated](./media/msdo-azure-devops-extension/image052.png)

6.  On the Agent job 1, click the **+** to add a step

![Graphical user interface, application Description automatically
generated](./media/msdo-azure-devops-extension/image053.png)

7.  In the search box type *Use .NET Core*

    Click **Add** *3 times*

![Graphical user interface, text, application, email Description
automatically generated](./media/msdo-azure-devops-extension/image054.png)

8.  Type *Microsoft Security* in the search box

    Click **Add** on **Microsoft Security DevOps** to add it to the Agent job 1

![Graphical user interface, text, application Description automatically
generated](./media/msdo-azure-devops-extension/image055.png)

9.  Click on *each* of the **Use .NET Core sdk** tasks and set the     versions as **3.1.x**, **5.0.x**, **6.0.x**

![Graphical user interface, application Description automatically
generated](./media/msdo-azure-devops-extension/image056.png)

10. Click **Save & queue** to open the dropdown menu

    Click **Save & queue**

![Graphical user interface, application Description automatically
generated](./media/msdo-azure-devops-extension/image057.png)

11. Type a Save comment (example: *Microsoft Security DevOps added*)

    Click **Save and run**

![Graphical user interface, text, application Description automatically
generated](./media/msdo-azure-devops-extension/image058.png)

>*It will take a few minutes to run pipelines and save the results. To make viewing the scan results easier, you can install this free extension in your Azure DevOps organization: [SARIF SAST Scans Tab - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=sariftools.scans)*
