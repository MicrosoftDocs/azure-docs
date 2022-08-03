---
 title: include file
 description: include file for creating an Azure Digital Twins instance in the quickstarts
 services: digital-twins
 author: baanders
 ms.service: digital-twins
 ms.topic: include
 ms.date: 5/9/2022
 ms.author: baanders
 ms.custom: include file
---

### Create an Azure Digital Twins instance

[!INCLUDE [digital-twins-setup-portal.md](digital-twins-setup-portal.md)]

3. Fill in the fields on the **Basics** tab of setup, including your Subscription, Resource group, a Resource name for your new instance, and Region. Check the **Assign Azure Digital Twins Data Owner Role** box to give yourself permissions to manage data in the instance.

    :::image type="content" source="../articles/digital-twins/media/quickstart-azure-digital-twins-explorer/create-azure-digital-twins-basics.png" alt-text="Screenshot of the Create Resource process for Azure Digital Twins in the Azure portal. The described values are filled in.":::

    >[!NOTE]
    > If the Assign Azure Digital Twins Data Owner Role box is greyed out, it means you don't have permissions in your Azure subscription to manage user access to resources. You can continue creating the instance in this section, and then should have someone with the necessary permissions [assign you this role on the instance](../articles/digital-twins/how-to-set-up-instance-portal.md#assign-the-role-using-azure-identity-management-iam) before completing the rest of this quickstart.
    >
    > Common roles that meet this requirement are **Owner**, **Account admin**, or the combination of **User Access Administrator** and **Contributor**.  

4. Select **Review + Create** to finish creating your instance.
    
5. You will see a summary page showing the details you've entered. Confirm and create the instance by selecting **Create**.

This will take you to an Overview page tracking the deployment status of the instance.

:::image type="content" source="../articles/digital-twins/media/quickstart-azure-digital-twins-explorer/deployment-in-progress.png" alt-text="Screenshot of the deployment page for Azure Digital Twins in the Azure portal. The page indicates that deployment is in progress.":::

Wait for the page to say that your deployment is complete.