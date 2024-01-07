---
title: include file
description: include file
services: azure-app-configuration
author: zhenlan

ms.service: azure-app-configuration
ms.topic: include
ms.date: 10/28/2022
ms.author: zhenlwa
ms.custom: include file
---

```html
<nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
    <div class="container">
        <a class="navbar-brand" asp-area="" asp-page="/Index">TestAppConfigNet3</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
            <ul class="navbar-nav flex-grow-1">
                <li class="nav-item">
                    <a class="nav-link text-dark" asp-area="" asp-page="/Index">Home</a>
                </li>
                <feature name="Beta">
                    <li class="nav-item">
                        <a class="nav-link text-dark" asp-area="" asp-page="/Beta">Beta</a>
                    </li>
                </feature>
                <li class="nav-item">
                    <a class="nav-link text-dark" asp-area="" asp-page="/Privacy">Privacy</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```
