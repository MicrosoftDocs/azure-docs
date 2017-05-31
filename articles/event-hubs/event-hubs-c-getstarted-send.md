---
title: Send events to Azure Event Hubs using C | Microsoft Docs
description: Send events to Azure Event Hubs using C
services: event-hubs
documentationcenter: ''
author: jtaubensee
manager: timlt
editor: ''

ms.assetid: 
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: c
ms.devlang: csharp
ms.topic: article
ms.date: 05/03/2017
ms.author: jotaub;sethm
---

# Send events to Azure Event Hubs using C

## Introduction
Event Hubs is a highly scalable ingestion system that can intake millions of events per second, enabling an application to process and analyze the massive amounts of data produced by your connected devices and applications. Once collected into Event Hubs, you can transform and store data using any real-time analytics provider or storage cluster.

For more information, please see the [Event Hubs overview][Event Hubs overview].

In this tutorial, you will learn how to send events to an event hub using a console application in C. To receive events, click the appropriate receiving language in the left-hand table of contents.

To complete this tutorial, you will need the following:

* A C development environment. For this tutorial, we will assume the gcc stack on an Azure Linux VM with Ubuntu 14.04.
* Microsoft Visual Studio, or Visual Studio Community Edition
* An active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).

## Send messages to Event Hubs
In this section we will write a C app to send events to your event hub. We will use the Proton AMQP library from the [Apache Qpid project](http://qpid.apache.org/). This is analogous to using Service Bus queues and topics with AMQP from C as shown [here](https://code.msdn.microsoft.com/Using-Apache-Qpid-Proton-C-afd76504). For more information, see [Qpid Proton documentation](http://qpid.apache.org/proton/index.html).

1. From the [Qpid AMQP Messenger page](http://qpid.apache.org/components/messenger/index.html), click the **Installing Qpid Proton** link and follow the instructions depending on your environment.
2. To compile the Proton library, install the following packages:
   
    ```shell
    sudo apt-get install build-essential cmake uuid-dev openssl libssl-dev
    ```
3. Download the [Qpid Proton library](http://qpid.apache.org/proton/index.html), and extract it, e.g.:
   
    ```shell
    wget http://archive.apache.org/dist/qpid/proton/0.7/qpid-proton-0.7.tar.gz
    tar xvfz qpid-proton-0.7.tar.gz
    ```
4. Create a build directory, compile and install:
   
    ```shell
    cd qpid-proton-0.7
    mkdir build
    cd build
    cmake -DCMAKE_INSTALL_PREFIX=/usr ..
    sudo make install
    ```
5. In your work directory, create a new file called **sender.c** with the following content. Remember to substitute the value for your event hub name and namespace name (the latter is usually `{event hub name}-ns`). You must also substitute a URL-encoded version of the key for the **SendRule** created earlier. You can URL-encode it [here](http://www.w3schools.com/tags/ref_urlencode.asp).
   
    ```c
    #include "proton/message.h"
    #include "proton/messenger.h"
   
    #include <getopt.h>
    #include <proton/util.h>
    #include <sys/time.h>
    #include <stddef.h>
    #include <stdio.h>
    #include <string.h>
    #include <unistd.h>
    #include <stdlib.h>
   
    #define check(messenger)                                                     
      {                                                                          
        if(pn_messenger_errno(messenger))                                        
        {                                                                        
          printf("check\n");                                                     
          die(__FILE__, __LINE__, pn_error_text(pn_messenger_error(messenger))); 
        }                                                                        
      }  
   
    pn_timestamp_t time_now(void)
    {
      struct timeval now;
      if (gettimeofday(&now, NULL)) pn_fatal("gettimeofday failed\n");
      return ((pn_timestamp_t)now.tv_sec) * 1000 + (now.tv_usec / 1000);
    }  
   
    void die(const char *file, int line, const char *message)
    {
      printf("Dead\n");
      fprintf(stderr, "%s:%i: %s\n", file, line, message);
      exit(1);
    }
   
    int sendMessage(pn_messenger_t * messenger) {
        char * address = (char *) "amqps://SendRule:{Send Rule key}@{namespace name}.servicebus.windows.net/{event hub name}";
        char * msgtext = (char *) "Hello from C!";
   
        pn_message_t * message;
        pn_data_t * body;
        message = pn_message();
   
        pn_message_set_address(message, address);
        pn_message_set_content_type(message, (char*) "application/octect-stream");
        pn_message_set_inferred(message, true);
   
        body = pn_message_body(message);
        pn_data_put_binary(body, pn_bytes(strlen(msgtext), msgtext));
   
        pn_messenger_put(messenger, message);
        check(messenger);
        pn_messenger_send(messenger, 1);
        check(messenger);
   
        pn_message_free(message);
    }
   
    int main(int argc, char** argv) {
        printf("Press Ctrl-C to stop the sender process\n");
   
        pn_messenger_t *messenger = pn_messenger(NULL);
        pn_messenger_set_outgoing_window(messenger, 1);
        pn_messenger_start(messenger);
   
        while(true) {
            sendMessage(messenger);
            printf("Sent message\n");
            sleep(1);
        }
   
        // release messenger resources
        pn_messenger_stop(messenger);
        pn_messenger_free(messenger);
   
        return 0;
    }
    ```
6. Compile the file, assuming **gcc**:
   
    ```
    gcc sender.c -o sender -lqpid-proton
    ```

	> [!NOTE]
	> In this code, we use an outgoing window of 1 to force the messages out as soon as possible. In general, your application should try to batch messages to increase throughput. See [Qpid AMQP Messenger page](http://qpid.apache.org/components/messenger/index.html) for more information about how to use the Qpid Proton library in this and other environments, and from platforms for which bindings are provided (currently Perl, PHP, Python, and Ruby).


## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview][Event Hubs overview]
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

<!-- Images. -->
[21]: ./media/event-hubs-c-ephcs-getstarted/run-csharp-ephcs1.png
[24]: ./media/event-hubs-c-ephcs-getstarted/receive-eph-c.png

<!-- Links -->
[Event Processor Host]: https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost
[Event Hubs overview]: event-hubs-what-is-event-hubs.md
[sample application that uses Event Hubs]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-286fd097
[Scale out Event Processing with Event Hubs]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-45f43fc3
