<properties
	pageTitle="Unity Roll a Ball tutorial"
	description="Steps to create the classic Unity Roll a Ball game which is a pre-requisite for all Mobile Engagement Unity tutorials"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="piyushjo"
	manager=""
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="03/25/2016"
	ms.author="piyushjo" />

#<a id="unity-roll-a-ball"></a>Create Unity Roll a Ball game

This tutorial walks through the main steps for a slightly modified [Unity Roll a Ball tutorial](http://unity3d.com/learn/tutorials/projects/roll-ball-tutorial). 
This sample game consists of a spherical 'player' object which is controlled by the app user and the objective of the game is to 'collect' collectible objects by colliding the player object with these collectible objects. 
This assumes basic familiarity with Unity editor environment. If you run into any issues then you should refer to the full tutorial. 

### Setting up the game
The steps below are from the [Unity tutorial](https://unity3d.com/learn/tutorials/projects/roll-a-ball/set-up?playlist=17141)

1. Open **Unity Editor** and click **New**. 
	
	![][51] 
	
2. Provide a **Project name** & **Location**, select **3D** and click **Create project**.
	
	![][52]

3. Save the default scene just created as part of the new project as with the name **MiniGame** within a new **\_Scenes** folder under **Assets** folder:
 	
	![][53]

4. Create a **3D Object -> Plane** as the playing field and rename this plane object as **Ground**

	![][1]

5. Reset the transform component for this **Ground** object so that it is at the Origin. 

	![][3]

6. Uncheck **Show Grid** from **Gizmos menu** for the **Ground** object.

	![][4]

7. Update the **Scale** component for the **Ground** object to be [X = 2,Y = 1, Z = 2]. 

	![][5]

8. Add a new **3D Object -> Sphere** to the project and rename this sphere object as **Player**. 

	![][6]

9. Select the **Player** object and click **Reset Transform** similar to the Plane object. 

10. Update **Transform -> Position -> Y Coordinate** component for the Player Y as 0.5.  

	![][7]

11. Create a new folder called **Materials** in the project where we will create the material to color the player. 

12. Create a new **Material** called **Background** in this folder. 

	![][8]

13. Update the color of the material by updating the **Albedo** property of it. You can select the RGB values of [0,32,64]. 

	![][9]

14. Drag this material into the scene view to apply color to the **Ground** object. 

	![][10]

17. Finally update the **Transform -> Rotation -> Y** to 60 on the Directional Light object for clarity. 

	![][12]

### Moving the player
The steps below are from the [Unity tutorial](https://unity3d.com/learn/tutorials/projects/roll-a-ball/moving-the-player?playlist=17141)

1. Add a **RigidBody** component to the **Player** object. 

	![][13]

2. Create a new folder called **Scripts** in the Project. 

3. Click **Add Component-> New Script -> C# Script**. Name it **PlayerController**, and click **Create and Add**. This will create and attach a script to the Player object.  

	![][14]

5. Move this script under the **Scripts** folder in the project. 

6. Open the script for editing in your favorite script editor, update the script code with the following code and save it. 

		using UnityEngine;
		using System.Collections;
		
		public class PlayerController : MonoBehaviour 
		{
			public float speed;
			private Rigidbody rb;
			void Start ()
			{
			    rb = GetComponent<Rigidbody>();
			}
			void FixedUpdate ()
			{
			    float moveHorizontal = Input.GetAxis ("Horizontal");
			    float moveVertical = Input.GetAxis ("Vertical");
				Vector3 movement = new Vector3 (moveHorizontal, 0.0f, moveVertical);
				rb.AddForce (movement * speed);
			}
		}
	
8. Note that the script above uses a **Speed** property. In the Unity editor, update the speed property to 10.  

	![][15]

9. Hit **Play** in the Unity Editor. Now you should be able to control the ball using the keyboard and it should rotate and move around. 

### Moving the camera
The steps below are from the [Unity tutorial](https://unity3d.com/learn/tutorials/projects/roll-a-ball/moving-the-camera?playlist=17141) and will tie the **Main Camera** to the **Player** object. 

1. Update the **Transform.Position** to be X = 0,  Y = 10.5, Z=-10.  
2. Update the **Transform.Rotation** to be X = 45, Y = 0, Z = 0.  

	![][16]

2. Add a new script called **CameraController** to the **MainCamera** and move it under the Scripts folder. 

	![][17]

3. Open up the script for editing and add the following code in it:

		using UnityEngine;
		using System.Collections;
		
		public class CameraController : MonoBehaviour {
		
		    public GameObject player;
		
		    private Vector3 offset;
		
		    void Start ()
		    {
		        offset = transform.position - player.transform.position;
		    }
		    
		    void LateUpdate ()
		    {
		        transform.position = player.transform.position + offset;
		    }
		}
	
5. In Unity environment - drag the Player variable into the Player slot for the Main Camera object so that the two are associated with one another. 

	![][18]

6. Now if you hit Play in the Unity editor and rotate the Player Ball object then you will see the Camera following it in the movement.  

### Setting up the Play area
The steps below are from the [Unity tutorial](https://unity3d.com/learn/tutorials/projects/roll-a-ball/setting-up-the-play-area?playlist=17141). We will create the Walls surrounding the Ground so that the Player Ball object doesn't drop off the play area in its movement. 

1. Click **Create -> Create Empty -> Game Object** and name it **Walls**

	![][19]

2. Under this Walls object - create a new **3D Object -> Cube** and name it "West wall". 

	![][20]

3. Update the **Transform -> Position** and **Transform -> Scale** for this West Wall object. 

	![][21]

4. Duplicate the West wall to create an **East wall** with the updated transform position and scale. 

	![][22]

5. Duplicate the East wall to create a **North wall** with the updated transform position & scale. 

	![][23]

6. Duplicate the North wall and create a **South wall** with the updated transform position & scale. 

	![][24]

### Creating Collectible objects
The steps below are from the [Unity tutorial](https://unity3d.com/learn/tutorials/projects/roll-a-ball/creating-collectables?playlist=17141). We will create some attractive looking objects which will form the set of collectible objects which the Player Ball object needs to 'collect' by colliding with them. 

1. Create a new **3D Cube object** and name it Pickup. 

2. Adjust the **Transform -> Rotation** & **Transform -> Scale** of the Pickup object. 

	![][25]

3. Create and attach a **new C# Script** called **Rotator** to the Pickup object. Make sure to put the script under the Scripts folder. 

	![][26]

4. Open this script for editing and update it to be the following: 

		using UnityEngine;
		using System.Collections;
		
		public class Rotator : MonoBehaviour {
		
		    void Update () 
		    {
		        transform.Rotate (new Vector3 (15, 30, 45) * Time.deltaTime);
		    }
		}

5. Now hit the Play mode in the Unity Editor and your Pickup object show be rotating on its axis.

6. Create a new folder called **Prefabs** 

	![][27]

7. Drag the **Pickup** object and put it in the Prefabs folder.

	![][28]

8. Create a new **Empty Game object** called **Pickups**. Reset its position to origin and then drag the Pickup object under this game object.  

	![][29]

9. Duplicate the **Pickup** object and spread it on the **Ground** object around the **Player** object by updating the **Transform.Position's X & Z** values appropriately. 

	![][30]

10. Create a **new material** called **Pickup** and update it to be Red in color by updating the **Albedo property** similar to what we did for updating the Ground object. 

	![][31]

11. Apply the material to all the 4 pickup objects.

	![][32]

### Collecting the Pickup objects
The steps below are from the [Unity tutorial](https://unity3d.com/learn/tutorials/projects/roll-a-ball/collecting-pick-up-objects?playlist=17141). We will update the Player so that it is able to 'collect' the pickup objects by colliding with them. 

1. Open up the **PlayerController** script attached to the Player object for editing and update it to the following:  

		using UnityEngine;
		using System.Collections;
		
		public class PlayerController : MonoBehaviour {
		
		    public float speed;
		
		    private Rigidbody rb;
		
		    void Start ()
		    {
		        rb = GetComponent<Rigidbody>();
		    }
		
		    void FixedUpdate ()
		    {
		        float moveHorizontal = Input.GetAxis ("Horizontal");
		        float moveVertical = Input.GetAxis ("Vertical");
		
		        Vector3 movement = new Vector3 (moveHorizontal, 0.0f, moveVertical);
		
		        rb.AddForce (movement * speed);
		    }
		
		    void OnTriggerEnter(Collider other) 
		    {
		        if (other.gameObject.CompareTag ("Pick Up"))
		        {
		            other.gameObject.SetActive (false);
		        }
		    }
		}

2. Create a new **Tag** called **Pick Up** (it must match what is in the script)  

	![][33]
	
	![][34]

3. Apply this **Tag** to the Prefab Pickup object. 

	![][35]

4. Enable **IsTrigger** checkbox for the Prefab object.

	![][36]

5. Add a Rigid body to Pickup Prefab object. For performance optimization we will update the static collider that we used to a Dynamic collider. 

	![][37]
  
6. Finally check the **IsKinematic** property for the prefab object. 

	![][38]

7. Hit **Play** in the Unity editor and you will be able to play this **Roll a Ball** game by moving the Player object using your keyboard keys for direction input. 

### Updating the game for mobile play
The sections above concluded the basic tutorial from Unity. Now we will modify the game to make it mobile device friendly. Note that we used keyboard input for the game so far for testing. Now we will modify it so that we can control the player by using the motion of the phone i.e. using Accelerometer as the input. 

Open up the **PlayerController** script for editing and update the **FixedUpdate** method to use the motion from the accelerometer to move the Player object. 

	    void FixedUpdate()
	    {
	        //float moveHorizontal = Input.GetAxis("Horizontal");
	        //float moveVertical = Input.GetAxis("Vertical");
	        //Vector3 movement = new Vector3(moveHorizontal, 0.0f, moveVertical);
	        rb.AddForce(Input.acceleration.x * Speed, 0, -Input.acceleration.z * Speed);
	    }

This tutorial concludes a basic game creation with Unity and you can deploy this on a device of your choice to play the game. 

<!-- Images -->
[1]: ./media/mobile-engagement-unity-roll-a-ball/1.png	
[2]: ./media/mobile-engagement-unity-roll-a-ball/2.png
[3]: ./media/mobile-engagement-unity-roll-a-ball/3.png
[4]: ./media/mobile-engagement-unity-roll-a-ball/4.png
[5]: ./media/mobile-engagement-unity-roll-a-ball/5.png
[6]: ./media/mobile-engagement-unity-roll-a-ball/6.png
[7]: ./media/mobile-engagement-unity-roll-a-ball/7.png
[8]: ./media/mobile-engagement-unity-roll-a-ball/8.png
[9]: ./media/mobile-engagement-unity-roll-a-ball/9.png	
[10]: ./media/mobile-engagement-unity-roll-a-ball/10.png	
[11]: ./media/mobile-engagement-unity-roll-a-ball/11.png	
[12]: ./media/mobile-engagement-unity-roll-a-ball/12.png
[13]: ./media/mobile-engagement-unity-roll-a-ball/13.png
[14]: ./media/mobile-engagement-unity-roll-a-ball/14.png
[15]: ./media/mobile-engagement-unity-roll-a-ball/15.png
[16]: ./media/mobile-engagement-unity-roll-a-ball/16.png
[17]: ./media/mobile-engagement-unity-roll-a-ball/17.png
[18]: ./media/mobile-engagement-unity-roll-a-ball/18.png
[19]: ./media/mobile-engagement-unity-roll-a-ball/19.png	
[20]: ./media/mobile-engagement-unity-roll-a-ball/20.png	
[21]: ./media/mobile-engagement-unity-roll-a-ball/21.png	
[22]: ./media/mobile-engagement-unity-roll-a-ball/22.png	
[23]: ./media/mobile-engagement-unity-roll-a-ball/23.png	
[24]: ./media/mobile-engagement-unity-roll-a-ball/24.png	
[25]: ./media/mobile-engagement-unity-roll-a-ball/25.png	
[26]: ./media/mobile-engagement-unity-roll-a-ball/26.png	
[27]: ./media/mobile-engagement-unity-roll-a-ball/27.png	
[28]: ./media/mobile-engagement-unity-roll-a-ball/28.png	
[29]: ./media/mobile-engagement-unity-roll-a-ball/29.png	
[30]: ./media/mobile-engagement-unity-roll-a-ball/30.png	
[31]: ./media/mobile-engagement-unity-roll-a-ball/31.png	
[32]: ./media/mobile-engagement-unity-roll-a-ball/32.png	
[33]: ./media/mobile-engagement-unity-roll-a-ball/33.png	
[34]: ./media/mobile-engagement-unity-roll-a-ball/34.png	
[35]: ./media/mobile-engagement-unity-roll-a-ball/35.png	
[36]: ./media/mobile-engagement-unity-roll-a-ball/36.png	
[37]: ./media/mobile-engagement-unity-roll-a-ball/37.png	
[38]: ./media/mobile-engagement-unity-roll-a-ball/38.png	
[51]: ./media/mobile-engagement-unity-roll-a-ball/new-project.png
[52]: ./media/mobile-engagement-unity-roll-a-ball/new-project-properties.png
[53]: ./media/mobile-engagement-unity-roll-a-ball/save-scene.png

	
	
	
	
	
	
	
	
	
	
	
	
