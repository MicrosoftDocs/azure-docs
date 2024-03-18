
## REST API

### Set up continuous export by using the REST API

You can set up and manage continuous export by using the Microsoft Defender for Cloud [automations API](/rest/api/defenderforcloud/automations). Use this API to create or update rules for exporting to any of the following destinations:

- Azure Event Hubs
- Log Analytics workspace
- Azure Logic Apps

You also can send the data to an [event hub or Log Analytics workspace in a different tenant](#export-data-to-an-event-hub-or-log-analytics-workspace-in-another-tenant).

Here are some examples of options that you can use only in the API:

- **Greater volume**: You can create multiple export configurations on a single subscription by using the API. The **Continuous Export** page in the Azure portal supports only one export configuration per subscription.

- **Additional features**: The API offers parameters that aren't shown in the Azure portal. For example, you can add tags to your automation resource and define your export based on a wider set of alert and recommendation properties than the ones that are offered on the **Continuous export** page in the Azure portal.

- **Focused scope**: The API offers you a more granular level for the scope of your export configurations. When you define an export by using the API, you can define it at the resource group level. If you're using the **Continuous export** page in the Azure portal, you must define it at the subscription level.

    > [!TIP]
    > These API-only options are not shown in the Azure portal. If you use them, a banner informs you that other configurations exist.

## Next step

> [!div class="nextstepaction"]
>
