---
title: Sample automation script for custom columns on on-premises management consoles - Microsoft Defender for IoT
description: Use a sample script when adding custom columns to your on-premises management console Device inventory page.
ms.topic: sample
ms.date: 07/12/2022

---

# Sample automation script for custom columns on on-premises management consoles

This article shows a sample script to use when adding custom columns to your on-premises management console **Device inventory** page.

For more information, see [Add to and enhance device inventory data](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md#add-to-and-enhance-device-inventory-data).

## Sample script for custom columns

Copy the following code to a local file and then modify it as needed to create your sample columns.

```python
#!/usr/local/bin/python 
# coding: utf8

from cyberx.custom_columns.custom_column import CustomColumnCommand
from cyberx.custom_columns.utils import TimeoutError
import requests
VA_SCORE = '0'
score = 'Secure Device'


class Impl(CustomColumnCommand):
    """ Here you can define global script-wise variables
        For example:
        name = ""
        In order to access those variable you should prefix it with "self." (self.name). """

    """ This method runs only once, before traversing all the assets in the inventory.
        You should use it to fetch global script-wise data from an external resource and store it in memory
        in order to prevent from the script to perform costly operation for each asset in the inventory. """
        
    
    
    def pre_calculation(self):
        self.log_info ("Start Pre-Calc")
        AccessToken = '27b2b023d6924a9d8885c07eace30478'
        self.VA_SCORE = requests.get(url = 'https://10.10.3.11/api/v1/reports/vulnerabilities/devices', headers = {'Authorization':AccessToken}, verify = False).json()
        self.log_info ("End Pre-Calc")
        pass

    """ This method runs only once, after traversing all the assets in the inventory.
        You should use it to clean resources created or opened in the pre_calculation method.
        Such resources could be temporary files or db connections for example. """
    def post_calculation(self):
        pass

    """ This method runs for each asset in the inventory.
        Here you should compute the requested value and return it using the valid_result or error_result utility methods (explained below).
        In order to access the asset data use the following list:

        asset inventory column name   - data key (data type)
        ===========================   - ====================
        Appliances                    - 'xsenses' (array of strings)
        Business Units                - 'businessUnits' (array of strings)
        Discovered                    - 'discovered' (date)
        Firmware Version              - 'firmwareVersion' (string)
        IP Address                    - 'ipAddress' (string)
        Is Authorized                 - 'isAuthorized' (boolean)
        Is Known as Scanner           - 'isScanner' (boolean)
        Is Programming Asset          - 'isProgramming' (boolean)
        Last Activity                 - 'lastActivity' (date)
        MAC Address                   - 'macAddress' (string)
        Model                         - 'model' (string)
        Module Address                - 'moduleAddress' (string)
        Name                          - 'name' (string)
        Operating System              - 'operatingSystem' (string)
        Protocols                     - 'protocols' (array of strings)
        Rack                          - 'rack' (string)
        Region                        - 'region' (string), 'regionId' (integer)
        Serial                        - 'serial' (string)
        Site                          - 'site' (string), 'siteId' (integer)
        Slot                          - 'slot' (string)
        Type                          - 'type' (string)
        Unhandled Alerts              - 'unhandledAlerts' (integer)
        Vendor                        - 'vendor' (string)
        Zone                          - 'zone' (string), 'zoneId' (integer)

        For example, in order to get the asset's IP address you should use asset['ipAddress'] and you will get it as a string. """
    def calculate(self, asset):
        self.log_info ("Start Calculate")
        
        ipAddress = asset['ipAddress']
        score = 'Secure Device'
        
        
        for device in self.VA_SCORE:
            if ipAddress in device['ipAddresses']:
                score = device['securityScore']
                        
        self.log_info ("End Calculate")
        return self.valid_result(score)

    """ This method is for testing the script functionality.
        You should use it in order to test that you are able to access an external resource or perform a complex computation.
        A good practice will be to at least run the pre_calculation and post_calculation methods and validate they work as expected.
        You should use the valid_result or error_result utility methods (explained below) when returning the test result. """
    def test(self):
        return self.valid_result(score)
        
    """ This method return TCP ports to open for outgoing communication (if needed).
        It should just return an array of port numbers, for example [234, 334, 3562]. """
    def get_outgoing_tcp_ports(self):
        return []

    """ This method return TCP ports to open for incoming communication (if needed).
        It should just return an array of port numbers, for example [234, 334, 3562]. """
    def get_incoming_tcp_ports(self):
        return []

    """ This method return UDP ports to open for outgoing communication (if needed).
        It should just return an array of port numbers, for example [234, 334, 3562]. """
    def get_outgoing_udp_ports(self):
        return []

    """ This method return UDP ports to open for incoming communication (if needed).
        It should just return an array of port numbers, for example [234, 334, 3562]. """
    def get_incoming_udp_ports(self):
        return []

    """ Utility methods at your disposal:

        self.valid_result(result):
        This method receives the result and indicates that the computation went well.

        self.error_result(error_message):
        This method receives an error message and indicates that the computation did not went well.

        self.log_info(message):
        This method will log the message in the dedicated custom columns log file named '/var/cyberx/logs/custom-columns.log'

        self.log_error(error_message):
        This method will log the error message as an error in the dedicated custom columns log file named '/var/cyberx/logs/custom-columns.log' """
```

## Next steps

For more information, see [Manage your OT device inventory from an on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md).