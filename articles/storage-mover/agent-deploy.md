---
title: How to deploy an Azure Storage Mover agent #Required; page title is displayed in search results. Include the brand.
description: Learn how to deploy an Azure Mover agent #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 07/27/2022
ms.custom: template-how-to
---

<!--

This template provides the basic structure of a HOW-TO article. A HOW-TO article is used to help the customer complete a specific task.

1. H1 (Docs Required)
   Start your H1 with a verb. Pick an H1 that clearly conveys the task the user will complete (example below).

-->

# Deploy an Azure Storage Mover agent

<!-- 

2. Introductory paragraph (Docs Required)
   Lead with a light intro that describes what the article covers. Answer the fundamental “why would I want to know this?” question. Keep it short (example provided below).

-->

Waffles rank highly on many Americans' list of favorite breakfast foods. Waffles are usually moist, occasionally slightly sweet, and most importantly, warm.

However, Oma only made waffles as a cake-like dessert in her heart-shaped waffle iron. Her waffles were great fresh, but also delicious when dried out and dunked in coffee. Our Tante Elise would whip these up when unexpected guests dropped by for Kaffee und Kuchen in the afternoon. Her callers could devour the first batch while the remainder baked in the waffle iron because they were both quicker and easier than Butterkuchen or Bienenstich.

This article guides you through the construction of Oma's waffles. After completing this how-to, you'll be able to experiment on your own to gain additional experience. You may also choose to continue providing simple waffles to friends and family.

<!-- 
3. Prerequisites (Optional)
   If you need prerequisites, make them your first H2 in a how-to guide. Use clear and unambiguous language and use a list format. Remove this section if prerequisites are not needed.

-->

## Prerequisites

- 250 g (8.81 oz) of melted butter
- 250 g (8.81 oz) of sugar
- 500 g (17.63 oz) of all purpose flour
- 6 eggs, XL
- 500 ml (16.9 oz) of milk
- 1 ½ teaspoons of baking powder
- grated lemon peel of 1 lemon
- 2 pouches of vanilla sugar
- 1 teaspoon of vanilla extract

<!-- 
4. H2s (Docs Required)

Prescriptively direct the customer through the procedure end-to-end. Don't link to other content (until 'next steps'), but include whatever the customer needs to complete the scenario in the article. -->

## Download agent VM

You'll need an agent VM to facilitate the migration of your files.

## Run the agent

Providing sufficient resources like RAM and compute cores to your agent is important.

# [Hyper-V](#tab/hyper-v)

1. Unpack the agent VHD to a local folder.
1. Create a new VM to host the agent.
1. Specify values for the agent VM's name and location (preferably in the same location as he VHD). Select **Next**.
1. Specify the generation of the agent VM - for now, only **Gen 1** is supported.
1. Provide adequate RAM for the agent VM (3072 MB dynamic RAM provided in our example).
1. Configure networking (**Not connected** for now). Select **Next**.
1. Select **Use an existing Virtual Hard Disk** and specify the unpacked agent VHD created earlier. Select **Next**.
1. Select **Finish**.

# [PowerShell](#tab/powershell)

Create the agent using the following sample code.

```azurepowershell
New-AzStorageMoverAgent -ResourceGroupName $ResourceGroupName -StorageMoverName $StorageMoverName -Name $agentName -ArcResourceId $arcId -Description "Agent description" -ArcVMUuid $guid #-Debug 
```

Validate agent creation using the following sample code.

```azurepowershell
Get-AzStorageMoverAgent -ResourceGroupName $ResourceGroupName -StorageMoverName $StorageMoverName -Name $agentName 
```

# [CLI](#tab/cli)

Content for CLI.

---

## Register the agent

Once your agent VM is running, you'll need to create trust to use it for migrations.

## Prepare the batter

The first step to making Haushaltswaffeln is the preparation of the batter. To prepare the batter, complete the steps listed below. 

1. Separate the eggs with an egg separator.
1. Using a handheld mixer beat the egg whites until stiff.
1. In a separate bowl add the egg yolks, sugar, grated lemon peel and vanilla sugar or vanilla extract and mix until creamy.
1. Slowly add the butter to the egg mixture and beat until smooth.
1. Mix the flour with baking powder and sift it into a bowl.
1. Alternate between flour and lukewarm milk and add these ingredients into the egg mixture.
1. Fold in the beaten egg whites using a pastry blender.

After the batter is prepared, you can begin baking the batter into the tasty Haushaltswaffeln.

## Cook the batter

In this section, you will cook the batter prepared in the previous section, resulting in a batch of warm and delicious Haushaltswaffeln.

Use the steps below to create your first batch.

1. Heat up a waffle maker.
1. Fill about ½ cup of batter in the waffle maker.
1. Close the waffle maker and bake the waffles until golden and crisp.

After the Haushaltswaffeln are cooked to perfection, it's time to serve your guests. This process is described in the next section.

## Serve the Haushaltswaffeln

Although you can dress Haushaltswaffeln up with a sprinkling of powdered sugar, they really need no embellishment. The flavour is rich and buttery, and they are nicely sweetened. You can give your callers the option to sprinkle some powdered sugar over the Haushaltswaffeln, or add whipped cream and fruit.

<!-- 

5. Next steps (Docs required)

A single link in the blue box format. Point to the next logical tutorial or how-to in a series, or, if there are no other tutorials or how-tos, to some other cool thing the customer can do. -->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Prepare Haushaltswaffeln for Fabian and Stephen](overview.md)
