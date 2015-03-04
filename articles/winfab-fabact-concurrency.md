<properties 
   pageTitle="FabAct Concurrency" 
   description="Introduction to FabAct concurrency" 
   services="winfabric" 
   documentationCenter=".net" 
   authors="clca" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="winfabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA" 
   ms.date="03/02/2015"
   ms.author="claudioc"/>

#Concurrency
Actor framework provides a simple turn based concurrency for actor methods. This means that no more than one thread can be active inside the actor method any time. The framework can provide this guarantees for the methods invocations that are done in response to receiving a message, timer callback or reminder callback. If the actor code creates a Task that is not associated with the Task returned by the actor methods or it creates a thread, the framework cannot provide any guarantees with respect to the concurrency of those executions. To perform a background operation, please use [Actor Timers]:(../winfab-fabact-timers) or [Actor Reminders]:(../winfab-fabact-reminders) that respect the turn based concurrency. 

Please note that a turn consistent complete execution of an actor method in response to the request from other actors or clients, or a timer / reminder callback. Even though these methods and callback are asynchronous. there is no interleaving. A turn must be completed fully before a new call is allowed. 

The framework however, allows reentrancy by default. This means that if an actor method of Actor A calls method on Actor B which in turn calls another method on actor A, that method is allowed to run as it is part of the same logical call chain context. All timer and reminder calls start with the new logical call context. See [Reentrancy]:(../winfab-fabact-reentrancy) section for more details.
