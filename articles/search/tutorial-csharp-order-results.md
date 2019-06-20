---
title: C# Tutorial on ordering results - Azure Search
description: This tutorial builds on the "Search results pagination - Azure Search" project, to add the ordering of search results. Learn how to order results on a primary value, and for results that have the same primary value, how to order results on a secondary value.
services: search
ms.service: search
ms.topic: tutorial
ms.author: v-pettur
author: PeterTurcan
ms.date: 05/01/2019
---

# C# Tutorial: Order the results - Azure Search

Up till this point in our series of tutorials, results are returned and displayed in the order that the data is located. This is somewhat random, and rarely the best user experience. In this tutorial, we will go into how to order results based on a primary value, and then for results that have the same primary value, how to order that selection on a secondary value.

In order to compare returned results easily, this project builds onto the infinite scrolling project created in the [C# Tutorial: Search results pagination - Azure Search](tutorial-csharp-paging.md) tutorial.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Order results based on one value
> * Order results based on multiple values
> * Filter results based on a distance from a geographical point
> * Take ordering even further

## Prerequisites

To complete this tutorial, you need to:

Have the infinite scrolling version of the [C# Tutorial: Search results pagination - Azure Search](tutorial-csharp-paging.md) project up and running. This can either be your own version, or install it from GitHub: [Create first app](https://github.com/Azure-Samples/azure-search-dotnet-samples).

## Order results based on one value

When we order results based on one value, say hotel rating, we not only want the ordered results, we also want confirmation that the order is correct. In other words, if we order on rating, we should display the rating in the view.

In this tutorial, we will also add a bit more to the display of results, the cheapest room rate, and the most expensive room rate, for each hotel. As we delve into ordering, we will also be adding values to make sure what we are ordering on is also displayed in the view.

There is no need to modify any of the models to enable ordering. Only the view and the controller need to be modified. Start by opening the home controller.

### Add the OrderBy property to the search parameters

1. All that it takes to order results based on a single numerical value, is to set the **OrderBy** parameter to the name of the property. In the **Index(SearchData model)** method, change the search parameters to the following code.

    ```cs

    ```

2. Now run the app. The results may or may not be in the correct order, as the user has no way of verifying the results.

3. Let's make it clear the results are ordered on rating. First, replace the .box1 and .box2 classes in the hotels.css file to the following.

    ```html
    xxx
    ```
4. Open the view (index.cshtml) and replace the rendering loop that begins with xxxx, with the following code.

    ```cs
    xxx
    ```
5. The rating needs to be available both in the first displayed page, and in the subsequent pages that are called via the infinite scroll. For the latter of these two we need to update the **Next** action in the controller. Change this method to the following code.

```cs
xxx
```
6. Now run the app again. Search on any common term, such as "wifi", and verify that the results are indeed ordered by descending order of hotel rating.

    You will notice that several hotels have an identical rating, and so their appearance in the display is again the order in which the data is found, which should not inspire a lot of confidence.

Before we look into adding a second level of ordering, let's add some code to display the range of room rates. We are adding this to both show extracting data from a _complex type_, and also so we can discuss perhaps ordering results based on price (cheapest first perhaps).

### Adding the range of room rates to the view

1. Change the rendering loop in the view to calculate the rate range for the first page of results.

```cs
xxx
```

2. Change the **Next** method in the home controller to calculate the rate range for subsequent pages of results.

    ```cs
    xxx
    ```

3. Run the app and verify the room rate ranges are displayed.


## Order results based on multiple values

The question now is how to differentiate between hotels with the same rating. Perhaps a good way would be to order on the basis of the last time the hotel was renovated. In other words, the more recently the hotel was renovated, the higher the hotel appears in the results.

1. To add a second level of ordering, change the **OrderBy** property in the **Index(SearchData model)** method to include the **LastRenovationDate** property.

```cs
xxx
```

2. Again we need to see the date in the view, just to be certain the ordering is correct. For such a thing as a renovation, perhaps just the year is required. Change the rendering loop to the following code, in the view.

```cs
xxx
```

3. Change the **Next** method in the home controller, to forward the year component of the last renovation date.

```cs
xxx
```

4. Run the app. Search on a common term, such as "pool" or "view", and verify that hotels with the same rating are now displayed in descending order of renovation date.

Image

## Filter results based on a distance from a geographical point

Rating, and renovation date, are examples of properties that are best displayed in a descending order. An alphabetical listing would be an example of a good use of ascending order (for example, if there was just one **OrderBy** property, and it was set to **HotelName** then an alphabetical order would be displayed). However, for our sample data, perhaps distance from a geographical point would be more appropriate.

To display results based on geographicsl distance, several steps are required.
1. Filter out all hotels that are outside of a specified radius from the given point. Do this by entering a filter with longitude, latitude, and radius parameters. Note that longitude is given first.

```cs
xxx
```

2. The above filter does _not_ order the results based on distance, it just removes the outliers. To order the results, enter an **OrderBy** setting that specifies the geoDistance method.

```cs
xxx
```

3. Although the results were returned by Azure Search using a distance filter, the calculated distance between the data and the specified point is _not_ returned. You have to re-calculate this value in the view, or controller if you want to display it in the results.

    The following code will calculate the distance between two lat/lon points.

    ```cs
    xxx
    ```
4. Now you have to tie this all together. However, this is as far as our tutorial goes - building a map based app is left as an exercise for the reader!

## Take ordering even further

The examples given in the tutorial so far show how to order on numerical values, which is certainly an exact process of ordering. However, some searches and some data do not lend themselves to such an easy comparison between two data elements. Azure Search includes the concept of _scoring_. _Scoring profiles_ can be specified for a set of data that can be used to provide more complex and qualitative comparisons, that should be most valuable when, say, comparing two documents to decide which should be dislayed first.

Scoring is outside the realm of this tutorial. For more details refer to the following resources.
* scoring
* scoring profiles



## Takeaways

Consider the following takeaways from this project:

* Users will expect search results to be ordered, most relevant first.
* The data needs to be structured so that ordering is easy. We were not able to sort on "cheapest" first easily, as the data is not structured to enable this to be done without additional code.
* There can be many levels to ordering, to differentiate between results that have the same value at a higher level of ordering.
* It is natural for some results to be ordered in ascending order (say, distance away from a point), and some in descending order (say, guest's rating).
* Scoring profiles can be defined when numerical comparisons are not available for a data set. Scoring each result will help to order and display them intelligently.

## Next steps

You have completed this series of C# tutorials - you should have gained valuable knowledge of the Azure Search APIs.

For further reference and tutorials, consider browsing [Microsoft Learn](https://docs.microsoft.com/learn/browse/?products=azure), or the other tutorials in the [Azure Search Documentation](https://docs.microsoft.com/azure/search/).
