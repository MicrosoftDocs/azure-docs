---
title: Azure Defender's vulnerability scanner for container images in CI/CD workflows
description: Learn about using Azure Defender for container registries to scan container images in CI/CD workflows
author: memildin
ms.author: memildin
ms.date: 05/25/2021
ms.topic: how-to
ms.service: security-center
manager: rkarlin

---

# Identify vulnerable container images in your CI/CD workflows

This page explains how to scan your Azure Container Registry-based container images with the integrated vulnerability scanner when they're built as part of your GitHub workflows.

To set up the scanner, you'll need to enable **Azure Defender for container registries** and the CI/CD integration. When your CI/CD workflows push images to your registries, you can view registry scan results and a summary of CI/CD scan results.

The findings of the CI/CD scans are an enrichment to the existing registry scan findings by Qualys. Azure Defender's CI/CD scanning is powered by [Aqua Trivy](https://github.com/aquasecurity/trivy).

You’ll get traceability information such as the GitHub workflow and the GitHub run URL, to help identify the workflows that are resulting in vulnerable images.

> [!TIP]
> The vulnerabilities identified in a scan of your registry might differ from the findings of your CI/CD scans. One reason for these  differences is that the registry scanning is [continuous](defender-for-container-registries-introduction.md#when-are-images-scanned), whereas the CI/CD scanning happens immediately before the workflow pushes the image into the registry.

## Availability

|Aspect|Details|
|----|:----|
|Release state:| **This CI/CD integration is in preview.**<br>We recommend that you experiment with it on non-production workflows only.<br>[!INCLUDE [Legalese](../../includes/security-center-preview-legal-text.md)]|
|Pricing:|**Azure Defender for container registries** is billed as shown on [Security Center pricing](https://azure.microsoft.com/pricing/details/security-center/)|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National/Sovereign (US Gov, Azure China)|
|||

## Prerequisites

To scan your images as they're pushed by CI/CD workflows into your registries, you must have **Azure Defender for container registries** enabled on the subscription. 

## Set up vulnerability scanning of your CI/CD workflows

To enable vulnerability scans of images in your GitHub workflows:

[Step 1. Enable the CI/CD integration in Security Center](#step-1-enable-the-cicd-integration-in-security-center)

[Step 2. Add the necessary lines to your GitHub workflow](#step-2-add-the-necessary-lines-to-your-github-workflow-and-perform-a-scan)

### Step 1. Enable the CI/CD integration in Security Center

1. From Security Center's sidebar, select **Pricing & settings**.
1. Select the relevant subscription.
1. From the sidebar of the settings page for that subscription, select **Integrations**.
1. In the pane that appears, select an Application Insights account to push the CI/CD scan results from your workflow.
1. Copy the authentication token and connection string into your GitHub workflow.

    :::image type="content" source="./media/defender-for-container-registries-cicd/enable-cicd-integration.png" alt-text="Enable the CI/CD integration for vulnerability scans of container images in your GitHub workflows." lightbox="./media/defender-for-container-registries-cicd/enable-cicd-integration.png":::

    > [!IMPORTANT]
    > The authentication token and connection string are used to correlate the ingested security telemetry with resources in the subscription. If you use invalid values for these parameters, it'll lead to dropped telemetry.

### Step 2. Add the necessary lines to your GitHub workflow and perform a scan

1. From your GitHub workflow, enable CI/CD scanning as follows:

    > [!TIP]
    > We recommend creating two secrets in your repository to reference in your YAML file as shown below. The secrets can be named according to your own naming conventions. In this example, the secrets are referenced as **AZ_APPINSIGHTS_CONNECTION_STRING** and **AZ_SUBSCRIPTION_TOKEN**.


    ```yml
    - run: |
      echo "github.sha=$GITHUB_SHA"
      docker build -t githubdemo1.azurecr.io/k8sdemo:${{ github.sha }}
    
    - uses: Azure/container-scan@v0 
      name: Scan image for vulnerabilities
      id: container-scan
      continue-on-error: true
      with:
        image-name: githubdemo1.azurecr.io/k8sdemo:${{ github.sha }} 
    
    - name: Push Docker image - githubdemo1.azurecr.io/k8sdemo:${{ github.sha }}
      run: |
      docker push githubdemo1.azurecr.io/k8sdemo:${{ github.sha }}
    
    - name: Post logs to appinsights
      uses: Azure/publish-security-assessments@v0
      with: 
        scan-results-path: ${{ steps.container-scan.outputs.scan-report-path }}
        connection-string: ${{ secrets.AZ_APPINSIGHTS_CONNECTION_STRING }}
        subscription-token: ${{ secrets.AZ_SUBSCRIPTION_TOKEN }} 
    ```

1. Run the workflow that will push the image to the selected container registry. Once the image is pushed into the registry, a scan of the registry runs and you can view the CI/CD scan results along with the registry scan results within Azure Security Center.

1. [View CI/CD scan results](#view-cicd-scan-results).

## View CI/CD scan results

1. To view the findings, go to the **Recommendations** page. If issues were found, you'll see the recommendation **Vulnerabilities in Azure Container Registry images should be remediated**.

    ![Recommendation to remediate issues .](media/monitor-container-security/acr-finding.png)

1. Select the recommendation. 

    The recommendation details page opens with additional information. This information includes the list of registries with vulnerable images ("Affected resources") and the remediation steps. 

1. Open the **affected resources** list and select an unhealthy registry to see the repositories within it that have vulnerable images.

    :::image type="content" source="media/defender-for-container-registries-cicd/select-registry.png" alt-text="Select an unhealthy registry.":::

    The registry details page opens with the list of affected repositories.

1. Select a specific repository to see the repositories within it that have vulnerable images.

    :::image type="content" source="media/defender-for-container-registries-cicd/select-repository.png" alt-text="Select an unhealthy repository.":::

    The repository details page opens. It lists the vulnerable images together with an assessment of the severity of the findings.

1. Select a specific image to see the vulnerabilities.

    :::image type="content" source="media/defender-for-container-registries-cicd/select-image.png" alt-text="Select an unhealthy image.":::

    The list of findings for the selected image opens.

    :::image type="content" source="media/defender-for-container-registries-cicd/cicd-scan-results.png" alt-text="Image scan results.":::

1. To learn more about which GitHub workflow is pushing these vulnerable images, select the information bubble:

    :::image type="content" source="media/defender-for-container-registries-cicd/cicd-findings.png" alt-text="CI/CD findings about specific GitHub branches and commits.":::



## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure Defender](azure-defender.md)
