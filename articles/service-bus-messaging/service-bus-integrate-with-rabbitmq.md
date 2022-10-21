---
title: How to integrate Service Bus with RabbitMQ
description: Step-by-step guide on how to integrate Service Bus with RabbitMQ
author: videlalvaro
ms.topic: how-to
ms.date: 11/17/2021
ms.author: alvidela
ms.custom: contperf-fy22q2
---

# How to integrate Service Bus with RabbitMQ

In this guide, we're going to learn how to send messages from RabbitMQ to Service Bus.

Here's a few scenarios in which we can make use of these capabilities:

- **Edge Setups**: We have an edge setup where we're sending messages to RabbitMQ, but we want to forward those messages to [Azure Service Bus](./service-bus-messaging-overview.md) for further processing, so we can use many of the [Azure Big Data capabilities](/azure/architecture/guide/architecture-styles/big-data).
- **Hybrid Cloud**: Your company just acquired a third party that uses RabbitMQ for their messaging needs. They are on a different cloud. While they transition to Azure you can already start sharing data by bridging RabbitMQ with Azure Service Bus.
- **Third-Party Integration**: A third party uses RabbitMQ as a broker, and wants to send their data to us, but they are outside our organization. We can provide them with SAS Key giving them access to a limited set of Azure Service Bus queues where they can forward their messages to.

The list goes on, but we can solve most of these use cases by bridging RabbitMQ to Azure.

First you need to create a free Azure account by signing up [here](https://azure.microsoft.com/free/)

Once you're signed in to your account, go to the [Azure portal](https://portal.azure.com/) and create a new Azure Service Bus [namespace](./service-bus-create-namespace-portal.md). Namespaces are the scoping containers where our messaging components will live, like queues and topics.

## Adding a new Azure Service Bus Namespace

In Azure portal, click the large plus button to add a new resource

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/create-resource.png" alt-text="Create resource":::

Then select Integration and click on Azure Service Bus to create a messaging namespace:

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/integration.png" alt-text="Select Azure Service bus":::

You'll be prompted to enter the namespace information. Select the Azure subscription you want to use. If you don't have a [resource group](../azure-resource-manager/management/manage-resource-groups-portal.md), you can create a new one.

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/create-namespace.png" alt-text="Create namespace":::

Use `rabbitmq` for `Namespace name`, but it could be anything you want. Then set `East US` for the location. Choose `Basic` as the price tier.

If all went well, you should see the following confirmation screen:

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/create-namespace-confirm.png" alt-text="Create namespace confirmation":::

Then back at the Azure portal you'll see your new `rabbitmq` namespace listed there. Click on it to access the resource so you can add a queue to it.

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/resource-view-with-namespace.png" alt-text="Resource list with new namespace":::

## Creating our Azure Service Bus Queue

Now that you have your Azure Service Bus namespace, click on the `Queues` button on the left, under `Entities`, so you can add a new queue:

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/create-queue.png" alt-text="Create queue":::

The name of the queue will be `from-rabbitmq` just as a reminder to where are the messages coming from. You can leave all the other options as defaults, but you can change them to fit the needs of your app.

## Enabling the RabbitMQ Shovel Plugin

To ship messages from RabbitMQ to Azure Service Bus, we're going to use the [Shovel Plugin](https://www.rabbitmq.com/shovel.html) that comes packaged with RabbitMQ. You can enable the plugin and its visual interface with this command:

```bash
rabbitmq-plugins enable rabbitmq_shovel_management
```

>You might need to run that command as root.

Now is time to get the credentials required for connecting RabbitMQ to Azure.

## Connecting RabbitMQ to Azure Service Bus

You'll need to create a [Shared Access Policy](../storage/common/storage-sas-overview.md) (SAS) for your queue, so RabbitMQ can publish messages to it. A SAS Policy let's you specify what external party is allowed to do with your resource. The idea is that RabbitMQ is able to send messages, but not listen or manage the queue.

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/create-sas-policy.png" alt-text="Add SAS Policy":::

Tick the `Send` box and then click `Create` to have our SAS Policy in place.

Once the policy has been created click on it to see the **Primary Connection String**. We're going to use it to let RabbitMQ talk to Azure Service Bus:

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/sas-policy-key.png" alt-text="Get SAS Policy":::

Before you can use that connection string, you'll need to convert it to RabbitMQ's AMQP connection format. So go to the [connection string converter tool](https://red-mushroom-0f7446a0f.azurestaticapps.net/) and paste your connection string in the form, click convert. You'll get a connection string that's RabbitMQ ready. (That website runs everything local in your browser so your data isn't sent over the wire). You can access its source code on [GitHub](https://github.com/videlalvaro/connstring_to_amqp).

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/converter.png" alt-text="Convert connection string":::

Now open the RabbitMQ management plugin in our browsers `http://localhost:15672/#/dynamic-shovels` and go to `Admin -> Shovel Management`, where you can add your new shovel that will take care of sending messages from a RabbitMQ queue to your Azure Service Bus queue.

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/add-shovel.png" alt-text="Add RabbitMQ Shovel":::

Here call your Shovel `azure` and choose `AMQP 0.9.1` as the source protocol. In the screenshot, we have `amqp://`, which is the default URI that connects us to a local RabbitMQ server. Make sure to adapt that to your current deployment.

On the queue side of things, you can use `azure` as the name of your queue. If that queue doesn't exist, RabbitMQ will create it for you. You can also choose the name of a queue that exists already. You can leave the other options as default.

Then on the `destination` side of things, choose `AMQP 1.0` as the protocol. In the `URI` field, enter the connecting string that you got from the previous step, were you converted your Azure connection string to the RabbitMQ format. It should look like this:

```
amqps://rabbitmq-shovel:StringOfRandomChars@rabbitmq.servicebus.windows.net:5671/?sasl=plain
```

In the `Address` field we'll enter the name of your **Azure Service Bus Queue**, in this case, it was called `from-rabbitmq`. Click `Add Shovel`, and your setup should be ready to start receiving messages.

## Publishing Messages from RabbitMQ to Azure Service Bus

In the RabbitMQ Management interface we can go to `Queues`, select the `azure` queue, and search for the `Publish message` panel. There a form will appear that will let you publish messages directly to your queue. For our example we're just going to add `first message` as the `Payload` and hit `Publish Message`:

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/first-message.png" alt-text="Publish first message":::

Go back to Azure and inspect your queue. Click `Service Bus Explorer` in the left panel, and then click the _Peek_ button. If all went well, you'll see your queue now has one message. Yay, congrats!

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/service-bus-queue.png" alt-text="Azure Service Bus Queue":::

But let's make sure that message is the one you sent from RabbitMQ. Select the `Peek` tab and click the `Peek` button to retrieve the last messages in your queue. Click on the message to inspect its contents. You should see something like the image below where your `first message` is listed.

:::image type="content" source="./media/service-bus-integrate-with-rabbitmq/peek.png" alt-text="Queue peek":::

## Let's Recap

Congrats! You achieved a lot! You managed to get your messages from RabbitMQ to Azure Service Bus, let's recap the steps:

1. Create an Azure Service Bus Namespace
2. Add a queue to the namespace
3. Add a SAS Policy to your queue
4. Get the queue connection string
5. Enable the RabbitMQ shovel plugin & the management interface
6. Convert the Azure Service Bus connection string to RabbitMQ's AMQP format
7. Add a new Shovel to RabbitMQ & connect it to Azure Service Bus
8. Publish messages

By following the previous steps, you integrated areas of your org that were outside Azure. The Shovel plugin allowed you to ship messages from RabbitMQ to Azure Service Bus. This has enormous advantages since you can now allow trusted third parties to connect their apps with your Azure deployment.

In the end, messaging is about enabling connections, and with this technique we just opened a new one.

## Next steps

- Learn more about [Azure Service Bus](./service-bus-messaging-overview.md)
- Learn more about [AMQP 1.0 support in Service Bus](./service-bus-amqp-overview.md)
