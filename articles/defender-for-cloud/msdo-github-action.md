# How-to Guide: Microsoft Security DevOps GitHub Action

Microsoft Security DevOps (MSDO) is a command line application that integrates static analysis tools into the development lifecycle. MSDO installs, configures, and runs the latest versions of static analysis tools (including, but not limited to, SDL/security and compliance tools). MSDO is data-driven with portable configurations that enable deterministic execution across multiple environments.

The MSDO leverages the following Open Source tools:
|  Name  |  Language   |  License  |
|----------------|-------|---------|
|[Bandit](https://github.com/PyCQA/bandit) | Python  | [Apache License 2.0](https://github.com/PyCQA/bandit/blob/master/LICENSE) |
|[BinSkim](https://github.com/Microsoft/binskim) | Binary -- Windows, ELF  | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE)|
|[ESlint](https://github.com/eslint/eslint)  |  Javascript |  [MIT License](https://github.com/eslint/eslint/blob/main/LICENSE)  |
|[Template Analyzer](https://github.com/Azure/template-analyzer) |  ARM template | [MIT License](https://github.com/Azure/template-analyzer/blob/main/LICENSE.txt)
|[Terrascan](https://github.com/accurics/terrascan) | Terraform (HCL2), Kubernetes (JSON/YAML), Helm v3, Kustomize, Dockerfiles, Cloud Formation | [Apache License 2.0](https://github.com/accurics/terrascan/blob/master/LICENSE)
|[Trivy](https://github.com/aquasecurity/trivy) | container images, file systems, git repositories | [Apache License 2.0](https://github.com/aquasecurity/trivy/blob/main/LICENSE)


*Prerequisite: follow the guidance to setup* [GitHub Advanced Security](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-security-and-analysis-settings-for-your-organization).

Browse to the Microsoft DevOps Security GitHub Action [here](https://github.com/marketplace/actions/security-devops-action)

## Setup GitHub Action

1.  Sign into [GitHub](https://www.github.com)

2.  Click on a repository to configure the GitHub Action

3.  Click **Actions** to get to the Workflows page

![Graphical user interface, application Description automatically
generated](./media/msdo-github-action/image031.png)

4.  Click **New workflow** to create a new workflow

![Graphical user interface, text, application Description automatically
generated](./media/msdo-github-action/image032.png)

5.  On the Get started with GitHub Actions page, click **set up a workflow yourself**

![Graphical user interface, application Description automatically
generated](./media/msdo-github-action/image033.png)

6.  In the workflow/main.yml text box, type a name for your workflow file (ex. msdevopssec.yml)

![Graphical user interface, text, application, email Description
automatically generated](./media/msdo-github-action/image034.png)

7.  In the \<\> Edit new file field, delete all the text, then cut and     paste the [sample action workflow](https://github.com/microsoft/security-devops-action/blob/main/.github/workflows/sample-workflow-windows-latest.yml):\
    For details on various input options, see [action.yml](https://github.com/microsoft/security-devops-action/blob/main/action.yml)


 ```
 name: MicrosoftDevOpsSecurity
 # Controls when the workflow will run
 on:
 # Triggers the workflow on push or pull request events but only for the main branch                                                       
 push:
 branches: \[ main \]
 pull_request:
 branches: \[ main \]
 # Allows you to run this workflow manually from the Actions tab
 workflow_dispatch:
 # A workflow run is made up of one or more jobs that can run sequentially or in parallel
 jobs:
 # This workflow contains a single job called \"build\"
 build:
 # The type of runner that the job will run on
 runs-on: windows-latest
 steps:
 # Checkout your code repository
 - uses: actions/checkout@v2
 # Install dotnet
 - uses: actions/setup-dotnet@v1
 with:
 dotnet-version: |
 5.0.x
 6.0.x
 # Run analyzers
 - name: Run Microsoft Security DevOps Analysis
 uses: microsoft/security-devops-action@preview
 id: msdo
 # Upload alerts to the Security tab
 - name: Upload alerts to Security tab
 uses: github/codeql-action/upload-sarif@v1
 with:
 sarif_file: \${{ steps.msdo.outputs.sarifFile }}
 ```                      

8.  Click **Start commit**

![Graphical user interface, text, application, email Description
automatically generated](./media/msdo-github-action/image035.png)

9.  In the Commit new file dialog, click **Commit new file**

![Graphical user interface, text, application Description automatically
generated](./media/msdo-github-action/image036.png)

10. Click on the Actions link to verify the running Action

![Graphical user interface, text, application, email Description
automatically generated](./media/msdo-github-action/image037.png)

### Steps: View Scan Results

1.  Click on **Security** tab in GitHub

2.  Click on **Code scanning alerts** (Microsoft Defender for DevOps Action results will surface here)

3.  Click on **Tool** dropdown menu to "Filter by tool"

![Graphical user interface, application Description automatically
generated](./media/msdo-github-action/image038.png)