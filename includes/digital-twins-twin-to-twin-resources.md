---
author: baanders
description: include file describing how to set up an Event Grid endpoint and route
ms.service: digital-twins
ms.topic: include
ms.date: 7/21/2021
ms.author: baanders
---

### Create the event grid topic

[Event Grid](../articles/event-grid/overview.md) is an Azure service that helps route and deliver events from Azure Services to other places within Azure. You can create an [event grid topic](../articles/event-grid/concepts.md) to collect certain events from a source, and then subscribers can listen on the topic to receive the events as they come through.

In Azure Cloud Shell, run the following command to create an event grid topic:

```azurecli-interactive
az eventgrid topic create --resource-group <your-resource-group> --name <name-for-your-event-grid-topic> --location <region>
```

The output from this command is information about the event grid topic you've created. Save the **name** that you gave to your event grid topic, because you'll use it later.

### Create the endpoint

Next, create an Event Grid endpoint in Azure Digital Twins, which will connect your instance to your event grid topic. Use the command below, filling in the name of your event grid topic and the other placeholder fields as needed.

```azurecli-interactive
az dt endpoint create eventgrid --dt-name <Azure-Digital-Twins-instance> --eventgrid-resource-group <your-resource-group> --eventgrid-topic <your-event-grid-topic> --endpoint-name <name-for-your-Azure-Digital-Twins-endpoint>
```

The output from this command is information about the endpoint you've created.

Look for the `provisioningState` field in the output, and check that the value is "Succeeded."

:::image type="content" source="../articles/digital-twins/media/tutorial-end-to-end/output-endpoints.png" alt-text="Screenshot of the result of the endpoint query in the Cloud Shell of the Azure portal, showing the endpoint with a provisioningState of Succeeded.":::

It may also say "Provisioning", meaning that the endpoint is still being created. If so, wait a few seconds and run the following command to check the status of the endpoint. Repeat until the `provisioningState` shows "Succeeded."

```azurecli-interactive
az dt endpoint show --dt-name <your-Azure-Digital-Twins-instance> --endpoint-name <your-Azure-Digital-Twins-endpoint> 
```

Save the **name** of your endpoint, because you'll use it later.

### Create the route

Next, create an Azure Digital Twins route that sends events to the Event Grid endpoint you just created. 

This can be done with the following CLI command (fill in the name of your endpoint and the other placeholder fields as needed). This command forwards all events that occur in the twin graph. You can limit the events to only specific ones if you want, by using [filters](../articles/digital-twins/how-to-manage-routes.md?tabs=portal%2Cportal2%2Cportal3#filter-events).

```azurecli-interactive
az dt route create --dt-name <your-Azure-Digital-Twins-instance> --endpoint-name <your-Azure-Digital-Twins-endpoint> --route-name <name-for-your-Azure-Digital-Twins-route>
```

The output from this command is some information about the route you've created.

>[!NOTE]
>Endpoints (from the previous step) must be finished provisioning before you can set up an event route that uses them. If the route creation fails because the endpoints aren't ready, wait a few minutes and then try again.