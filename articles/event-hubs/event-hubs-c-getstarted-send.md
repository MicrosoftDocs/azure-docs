---
title: 'Quickstart: Send events using C - Azure Event Hubs'
description: 'Quickstart: This article provides a walkthrough for creating a C application that sends events to Azure Event Hubs.'
ms.topic: quickstart
ms.date: 09/23/2021
ms.devlang: c
ms.custom: mode-other
---

# Quickstart: Send events to Azure Event Hubs using C

## Introduction
Azure Event Hubs is a Big Data streaming platform and event ingestion service, capable of receiving and processing millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For detailed overview of Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md).

This tutorial describes how to send events to an event hub using a console application in C.

## Prerequisites
To complete this tutorial, you need the following:

* A C development environment. This tutorial assumes the gcc stack on an Azure Linux VM with Ubuntu 14.04.
* [Microsoft Visual Studio](https://www.visualstudio.com/).
* **Create an Event Hubs namespace and an event hub**. Use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md). Get the value of access key for the event hub by following instructions from the article: [Get connection string](event-hubs-get-connection-string.md#azure-portal). You use the access key in the code you write later in this tutorial. The default key name is: **RootManageSharedAccessKey**.

## Write code to send messages to Event Hubs
In this section shows how to write a C app to send events to your event hub. The code uses the Proton AMQP library from the [Apache Qpid project](https://qpid.apache.org/). This is analogous to using Service Bus queues and topics with AMQP from C as shown [in this sample](https://code.msdn.microsoft.com/Using-Apache-Qpid-Proton-C-afd76504). For more information, see the [Qpid Proton documentation](https://qpid.apache.org/proton/index.html).

1. From the [Qpid AMQP Messenger page](https://qpid.apache.org/proton/messenger.html), follow the instructions to install Qpid Proton, depending on your environment.
2. To compile the Proton library, install the following packages:

    ```shell
    sudo apt-get install build-essential cmake uuid-dev openssl libssl-dev
    ```
3. Download the [Qpid Proton library](https://qpid.apache.org/proton/index.html), and extract it, e.g.:

    ```shell
    wget https://archive.apache.org/dist/qpid/proton/0.7/qpid-proton-0.7.tar.gz
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
5. In your work directory, create a new file called **sender.c** with the following code. Remember to replace the values for your SAS key/name, event hub name, and namespace. You must also substitute a URL-encoded version of the key for the **SendRule** created earlier. You can URL-encode it [here](https://www.w3schools.com/tags/ref_urlencode.asp).

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
    #include <signal.h>

    volatile sig_atomic_t stop = 0;

    #define check(messenger)                                                     \
      {                                                                          \
        if(pn_messenger_errno(messenger))                                        \
        {                                                                        \
          printf("check\n");                                                     \
          die(__FILE__, __LINE__, pn_error_text(pn_messenger_error(messenger))); \
        }                                                                        \
      }

    void interrupt_handler(int signum){
      if(signum == SIGINT){
        stop = 1;
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
        char * address = (char *) "amqps://{SAS Key Name}:{SAS key}@{namespace name}.servicebus.windows.net/{event hub name}";
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
        signal(SIGINT, interrupt_handler);

        pn_messenger_t *messenger = pn_messenger(NULL);
        pn_messenger_set_outgoing_window(messenger, 1);
        pn_messenger_start(messenger);

        while(!stop) {
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
   > This code uses an outgoing window of 1 to force the messages out as soon as possible. It is recommended that your application try to batch messages to increase throughput. See the [Qpid AMQP Messenger page](https://qpid.apache.org/proton/messenger.html) for information about how to use the Qpid Proton library in this and other environments, and from platforms for which bindings are provided (currently Perl, PHP, Python, and Ruby).

Run the application to send messages to the event hub.

Congratulations! You have now sent messages to an event hub.

## Next steps
Read the following articles:

- [EventProcessorHost](event-hubs-event-processor-host.md)
- [Features and terminology in Azure Event Hubs](event-hubs-features.md).


<!-- Images. -->
[21]: ./media/event-hubs-c-ephcs-getstarted/run-csharp-ephcs1.png
[24]: ./media/event-hubs-c-ephcs-getstarted/receive-eph-c.png
