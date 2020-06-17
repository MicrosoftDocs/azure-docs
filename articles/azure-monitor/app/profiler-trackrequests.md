---
title: Write code to track requests with Azure Application Insights | Microsoft Docs
description: Write code to track requests with Application Insights so you can get profiles for your requests.
ms.topic: conceptual
author: cweining
ms.author: cweining
ms.date: 08/06/2018

ms.reviewer: mbullwin
---

# Write code to track requests with Application Insights

To view profiles for your application on the Performance page, Azure Application Insights needs to track requests for your application. Application Insights can automatically track requests for applications that are built on already-instrumented frameworks. Two examples are ASP.NET and ASP.NET Core. 

For other applications, such as Azure Cloud Services worker roles and Service Fabric stateless APIs, you need to write code to tell Application Insights where your requests begin and end. After you've written this code, requests telemetry is sent to Application Insights. You can view the telemetry on the Performance page, and profiles are collected for those requests. 

To manually track requests, do the following:

  1. Early in the application lifetime, add the following code:  

        ```csharp
        using Microsoft.ApplicationInsights.Extensibility;
        ...
        // Replace with your own Application Insights instrumentation key.
        TelemetryConfiguration.Active.InstrumentationKey = "00000000-0000-0000-0000-000000000000";
        ```
      For more information about this global instrumentation key configuration, see [Use Service Fabric with Application Insights](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started/blob/dev/appinsights/ApplicationInsights.md).  

  1. For any piece of code that you want to instrument, add a `StartOperation<RequestTelemetry>` **using** statement around it, as shown in the following example:

        ```csharp
        using Microsoft.ApplicationInsights;
        using Microsoft.ApplicationInsights.DataContracts;
        ...
        var client = new TelemetryClient();
        ...
        using (var operation = client.StartOperation<RequestTelemetry>("Insert_Your_Custom_Event_Unique_Name"))
        {
          // ... Code I want to profile.
        }
        ```

        Calling `StartOperation<RequestTelemetry>` within another `StartOperation<RequestTelemetry>` scope isn't supported. You can use `StartOperation<DependencyTelemetry>` in the nested scope instead. For example:  
        
        ```csharp
        using (var getDetailsOperation = client.StartOperation<RequestTelemetry>("GetProductDetails"))
        {
        try
        {
          ProductDetail details = new ProductDetail() { Id = productId };
          getDetailsOperation.Telemetry.Properties["ProductId"] = productId.ToString();
        
          // By using DependencyTelemetry, 'GetProductPrice' is correctly linked as part of the 'GetProductDetails' request.
          using (var getPriceOperation = client.StartOperation<DependencyTelemetry>("GetProductPrice"))
          {
              double price = await _priceDataBase.GetAsync(productId);
              if (IsTooCheap(price))
              {
                  throw new PriceTooLowException(productId);
              }
              details.Price = price;
          }
        
          // Similarly, note how 'GetProductReviews' doesn't establish another RequestTelemetry.
          using (var getReviewsOperation = client.StartOperation<DependencyTelemetry>("GetProductReviews"))
          {
              details.Reviews = await _reviewDataBase.GetAsync(productId);
          }
        
          getDetailsOperation.Telemetry.Success = true;
          return details;
        }
        catch(Exception ex)
        {
          getDetailsOperation.Telemetry.Success = false;
        
          // This exception gets linked to the 'GetProductDetails' request telemetry.
          client.TrackException(ex);
          throw;
        }
        }
        ```
