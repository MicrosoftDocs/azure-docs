---
author: ramonarguelles
manager: vriveras
services: azure-spatial-anchors

ms.date: 04/03/2019
ms.topic: include
ms.author: rgarcia
ms.service: azure-spatial-anchors
---
## Putting everything together

Here is how the complete `MainActivity` class file should look like, after all
the different elements have been put together. You can use it as a reference to
compare against your own file, and spot if you may have any differences left.

```java
package com.example.myfirstapp;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.google.ar.core.HitResult;
import com.google.ar.core.Plane;
import com.google.ar.sceneform.AnchorNode;
import com.google.ar.sceneform.math.Vector3;
import com.google.ar.sceneform.rendering.Color;
import com.google.ar.sceneform.rendering.MaterialFactory;
import com.google.ar.sceneform.rendering.Renderable;
import com.google.ar.sceneform.rendering.ShapeFactory;
import com.google.ar.sceneform.ux.ArFragment;

import android.view.MotionEvent;
import android.util.Log;

import com.google.ar.sceneform.ArSceneView;
import com.google.ar.sceneform.Scene;
import com.microsoft.azure.spatialanchors.CloudSpatialAnchor;
import com.microsoft.azure.spatialanchors.CloudSpatialAnchorSession;
import com.microsoft.azure.spatialanchors.SessionLogLevel;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.microsoft.azure.spatialanchors.AnchorLocateCriteria;
import com.microsoft.azure.spatialanchors.LocateAnchorStatus;

public class MainActivity extends AppCompatActivity {

    private boolean tapExecuted = false;
    private final Object syncTaps = new Object();
    private ArFragment arFragment;
    private AnchorNode anchorNode;
    private Renderable nodeRenderable = null;
    private float recommendedSessionProgress = 0f;

    private ArSceneView sceneView;
    private CloudSpatialAnchorSession cloudSession;

    private String anchorId = null;
    private boolean scanningForUpload = false;
    private final Object syncSessionProgress = new Object();
    private ExecutorService executorService = Executors.newSingleThreadExecutor();

    // <onCreate>
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        this.arFragment = (ArFragment) getSupportFragmentManager().findFragmentById(R.id.ux_fragment);
        this.arFragment.setOnTapArPlaneListener(this::handleTap);

        this.sceneView = arFragment.getArSceneView();
        Scene scene = sceneView.getScene();
        scene.addOnUpdateListener(frameTime -> {
            if (this.cloudSession != null) {
                this.cloudSession.processFrame(sceneView.getArFrame());
            }
        });

        initializeSession();
    }
    // </onCreate>

    // <initializeSession>
    private void initializeSession() {
        if (this.cloudSession != null){
            this.cloudSession.close();
        }
        this.cloudSession = new CloudSpatialAnchorSession();
        this.cloudSession.setSession(sceneView.getSession());
        this.cloudSession.setLogLevel(SessionLogLevel.Information);
        this.cloudSession.addOnLogDebugListener(args -> Log.d("ASAInfo", args.getMessage()));
        this.cloudSession.addErrorListener(args -> Log.e("ASAError", String.format("%s: %s", args.getErrorCode().name(), args.getErrorMessage())));

        this.cloudSession.addSessionUpdatedListener(args -> {
            synchronized (this.syncSessionProgress) {
                this.recommendedSessionProgress = args.getStatus().getRecommendedForCreateProgress();
                Log.i("ASAInfo", String.format("Session progress: %f", this.recommendedSessionProgress));
                if (!this.scanningForUpload)
                {
                    return;
                }
            }

            runOnUiThread(() -> {
                synchronized (this.syncSessionProgress) {
                    MaterialFactory.makeOpaqueWithColor(this, new Color(
                            this.recommendedSessionProgress,
                            this.recommendedSessionProgress,
                            this.recommendedSessionProgress))
                        .thenAccept(material -> {
                            this.nodeRenderable.setMaterial(material);
                        });
                }
            });
        });

        this.cloudSession.addAnchorLocatedListener(args -> {
            if (args.getStatus() == LocateAnchorStatus.Located)
            {
                runOnUiThread(()->{
                    this.anchorNode = new AnchorNode();
                    this.anchorNode.setAnchor(args.getAnchor().getLocalAnchor());
                    MaterialFactory.makeOpaqueWithColor(this, new Color(android.graphics.Color.GREEN))
                        .thenAccept(greenMaterial -> {
                            this.nodeRenderable = ShapeFactory.makeSphere(0.1f, new Vector3(0.0f, 0.15f, 0.0f), greenMaterial);
                            this.anchorNode.setRenderable(nodeRenderable);
                            this.anchorNode.setParent(arFragment.getArSceneView().getScene());

                            this.anchorId = null;
                            synchronized (this.syncTaps) {
                                this.tapExecuted = false;
                            }
                        });
                });
            }
        });

        this.cloudSession.getConfiguration().setAccountId(/* Copy your account Identifier in here */);
        this.cloudSession.getConfiguration().setAccountKey(/* Copy your account Key in here */);
        this.cloudSession.start();
    }
    // </initializeSession>

    // <handleTap>
    protected void handleTap(HitResult hitResult, Plane plane, MotionEvent motionEvent) {
        synchronized (this.syncTaps) {
            if (this.tapExecuted) {
                return;
            }

            this.tapExecuted = true;
        }

        if (this.anchorId != null) {
            this.anchorNode.getAnchor().detach();
            this.anchorNode.setParent(null);
            this.anchorNode = null;
            initializeSession();
            AnchorLocateCriteria criteria = new AnchorLocateCriteria();
            criteria.setIdentifiers(new String[]{this.anchorId});
            cloudSession.createWatcher(criteria);
            return;
        }

        this.anchorNode = new AnchorNode();
        this.anchorNode.setAnchor(hitResult.createAnchor());
        CloudSpatialAnchor cloudAnchor = new CloudSpatialAnchor();
        cloudAnchor.setLocalAnchor(this.anchorNode.getAnchor());

        MaterialFactory.makeOpaqueWithColor(this, new Color(
                this.recommendedSessionProgress,
                this.recommendedSessionProgress,
                this.recommendedSessionProgress))
            .thenAccept(material -> {
                this.nodeRenderable = ShapeFactory.makeSphere(0.1f, new Vector3(0.0f, 0.15f, 0.0f), material);
                this.anchorNode.setRenderable(nodeRenderable);
                this.anchorNode.setParent(arFragment.getArSceneView().getScene());

                uploadCloudAnchorAsync(cloudAnchor)
                    .thenAccept(id -> {
                        this.anchorId = id;
                        Log.i("ASAInfo", String.format("Cloud Anchor created: %s", this.anchorId));
                        runOnUiThread(() -> {
                            MaterialFactory.makeOpaqueWithColor(this, new Color(android.graphics.Color.BLUE))
                                .thenAccept(blueMaterial -> {
                                    this.nodeRenderable.setMaterial(blueMaterial);
                                    synchronized (this.syncTaps) {
                                        this.tapExecuted = false;
                                    }
                                });
                        });
                    });
            });
    }
    // </handleTap>

    // <uploadCloudAnchorAsync>
    private CompletableFuture<String> uploadCloudAnchorAsync(CloudSpatialAnchor anchor) {
        synchronized (this.syncSessionProgress) {
            this.scanningForUpload = true;
        }

        return CompletableFuture.runAsync(() -> {
            try {
                float currentSessionProgress;
                do {
                    synchronized (this.syncSessionProgress) {
                        currentSessionProgress = this.recommendedSessionProgress;
                    }
                    if (currentSessionProgress < 1.0) {
                        Thread.sleep(500);
                    }
                }
                while (currentSessionProgress < 1.0);

                synchronized (this.syncSessionProgress) {
                    this.scanningForUpload = false;
                }
                runOnUiThread(() -> {
                    MaterialFactory.makeOpaqueWithColor(this, new Color(android.graphics.Color.YELLOW))
                        .thenAccept(yellowMaterial -> {
                            this.nodeRenderable.setMaterial(yellowMaterial);
                        });
                });

                this.cloudSession.createAnchorAsync(anchor).get();
            } catch (InterruptedException | ExecutionException e) {
                Log.e("ASAError", e.toString());
                throw new RuntimeException(e);
            }
        }, executorService).thenApply(ignore -> anchor.getIdentifier());
    }
    // </uploadCloudAnchorAsync>
}
```

## Next steps

In this tutorial, you've seen how to create a new Android app that integrates ARCore functionality with Azure Spatial Anchors. To learn more about the Azure Spatial Anchors library, continue to our guide on how to create and locate anchors.

> [!div class="nextstepaction"]
> [Create and locate anchors using Azure Spatial Anchors](/azure/spatial-anchors/create-locate-anchors-overview)
