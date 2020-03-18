---
title: Authentication and Authorization
description: Learn about the various ways an app or service can authenticate to Spool, and the levels of control that you have to gate access to various features.
author: mikben
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/18/2020
ms.topic: conceptual
ms.service: azure-project-spool

---

# Authentication and Authorization

TODO

## Overview

![An overview of authentication to Azure Spatial Anchors](./media/spatial-anchors-authentication-overview.png)

TODO

## Account keys

TODO

# [C#](#tab/csharp)

```csharp
this.cloudSession.Configuration.AccountKey = @"MyAccountKey";
```

# [ObjC](#tab/objc)

```objc
_cloudSession.configuration.accountKey = @"MyAccountKey";
```

# [Swift](#tab/swift)

```swift
_cloudSession!.configuration.accountKey = "MyAccountKey"
```

# [Java](#tab/java)

```java
mCloudSession.getConfiguration().setAccountKey("MyAccountKey");
```

# [C++ NDK](#tab/cpp)

```cpp
auto configuration = cloudSession_->Configuration();
configuration->AccountKey(R"(MyAccountKey)");
```

# [C++ WinRT](#tab/cppwinrt)

```cpp
auto configuration = m_cloudSession.Configuration();
configuration.AccountKey(LR"(MyAccountKey)");
```

---

TODO

> [!WARNING]
> TODO

