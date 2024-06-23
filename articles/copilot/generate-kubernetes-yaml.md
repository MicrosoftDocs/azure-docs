---
title:  Create Kubernetes YAML files for AKS clusters using Microsoft Copilot in Azure
description: Learn how Microsoft Copilot in Azure can help you create Kubernetes YAML files for you to customize and use.
ms.date: 05/28/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom:
  - ignite-2023
  - ignite-2023-copilotinAzure
  - build-2024
ms.author: jenhayes
author: JnHs
---

# Create Kubernetes YAML files using Microsoft Copilot in Azure

Microsoft Copilot in Azure (preview) can help you create [Kubernetes YAML files](/azure/aks/concepts-clusters-workloads#deployments-and-yaml-manifests) to apply [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) clusters. Generated YAML files adhere to best practices so that you can focus more on your applications and less on the underlying infrastructure. You can also get help when authoring your own YAML files by asking Microsoft Copilot to make changes, fix problems, or explain elements in the context of your specific scenario.

When you ask Microsoft Copilot in Azure for help with Kubernetes YAML files, it prompts you to open the YAML deployment editor. From there, you can use Microsoft Copilot in Azure help you create, edit, and format the desired YAML file to create your cluster.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Generate Kubernetes YAML files using Microsoft Copilot in Azure

Microsoft Copilot in Azure can help you generate Kubernetes YAML files to apply to your AKS cluster pr create a new deployment. You provide your application specifications, such as container images, resource requirements, and networking preferences. Microsoft Copilot in Azure uses your input to generate comprehensive YAML files that define the desired Kubernetes deployments, services, and other resources, effectively encapsulating the infrastructure as code.

When you ask Microsoft Copilot in Azure for help with Kubernetes YAML files, it asks if you'd like to open the YAML deployment editor.

 :::image type="content" source="media/generate-kubernetes-yaml/aks-yaml-question.png" alt-text="Screenshot of a prompt for help generating an AKS YAML file in Microsoft Copilot in Azure.":::

After you confirm, the YAML deployment editor appears. From here, you can enter **ALT + I** to open an inline Copilot prompt. Enter prompts here to see generated YAML based on your requirements.

:::image type="content" source="media/generate-kubernetes-yaml/aks-yaml-editor.png" alt-text="Screenshot showing the YAML editor with a prompt to create an AKS deployment.":::

## Get help working with Kubernetes files in the YAML editor

Once Microsoft Copilot in Azure has generated a YAML file for you, you can continue to work in the YAML editor to make changes. You can also start from scratch and enter your own YAML directly into the editor. In the YAML editor, Microsoft Copilot in Azure offers several features that help you quickly create valid YAML files.

When working in the AKS YAML editor, enter **ALT + I** to open an inline Copilot prompt.

### Autocomplete

Microsoft Copilot in Azure automatically provides autocomplete suggestions based on your input.

:::image type="content" source="media/generate-kubernetes-yaml/aks-yaml-autocomplete.png" alt-text="Screenshot showing Microsoft Copilot in Azure providing autocomplete suggestions in an AKS YAML file.":::

### Natural language questions

You can use the inline Copilot control (**ALT + I**) to request specific changes using natural languages. For example, you can say **Update to use the latest nginx**.

:::image type="content" source="media/generate-kubernetes-yaml/aks-yaml-update-request.png" alt-text="Screenshot of a request for Microsoft Copilot in Azure to update an AKS YAML file. ":::

Based on your request, Microsoft Copilot in Azure makes changes to your YAML, with differences highlighted.

:::image type="content" source="media/generate-kubernetes-yaml/aks-yaml-update-result.png" alt-text="Screenshot showing the changes Microsoft Copilot in Azure made to the YAML file.":::

Select **Accept** to save these changes, or select the **X** to reject them. To make further changes before accepting, you can enter a different query and then select the **Refresh** button to see the new changes.

You can also select the **Diff** button to toggle the diff view between inline and side-by-side.

:::image type="content" source="media/generate-kubernetes-yaml/aks-yaml-diff.png" alt-text="Screenshot showing the side-by-side diff view in the AKS YAML editor, with the toggle button highlighted.":::

### Built-in commands

When working with YAML files, Microsoft Copilot in Azure provides built-in commands to help you work more efficiently. To access these commands, type **/** into the inline Copilot control.

 :::image type="content" source="media/generate-kubernetes-yaml/aks-yaml-commands.png" alt-text="Screenshot showing the commands available in the inline Microsoft Copilot in Azure control in an AKS YAML file.":::

The following commands are currently available:

- **/explain**: Get more information about a section or element of your YAML file.
- **/format**: Apply standard indentation or fix other formatting issues.
- **/fix**: Resolve problems with invalid YAML.
- **/discard**: Discard previously-made changes.
- **/chat**: Open a full Microsoft Copilot in Azure pane.
- **/close**: Closes the inline Copilot control.
- **/retry**: Tries the previous prompt again.

## Next steps

- Learn about more ways that Microsoft Copilot in Azure can [help you work with AKS](work-aks-clusters.md).
- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- Learn more about [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes).
