# driver-ui-vr
UI extension that uses semantic annotations to display data in 3D

## Installing
To use this project, first make sure to have corto installed:
```
curl https://corto.io/install-dev-src | sh
```

Then run the following commands to download & build the VR UI to your local package repository:
```
git clone https://github.com/cortoproject/driver-ui-vr
bake driver-ui-vr
```

You can now start any project that serves up the corto UI. If you want to create a project from scratch, do:
```
corto create MyUiServer
mkdir MyUiServer/config
touch MyUiServer/config/config.json
```
Then add the following configuration to `config.json` to create a websocket service and a service that servers static content on port 9090:
```json
{
    "id": "config/ws_service",
    "type": "corto/ws/service",
    "value": {
        "port": 9090
    }
},
{
    "id": "config/ui_service",
    "type": "corto/ui/service",
    "value": {
        "port": 9090
    }
}
```
You can now run the project by doing:
```
corto run MyUiServer --interactive
```
Now, go to `http://localhost:9090`, and you should see the icon of the VR plugin (two stacked squares). If you click on the icon, you should see a grey plane and a dark background (likely no objects).

## Visualizing data
The UI can only visualize data that has been annotated with semantic tags. Tags tell corto what a member of a type means, like for example that it is a position, color or rotation. To create data that can be visualized, create a type like this:
```
struct Point:/
    x: int32, tags={tags/position/x}
    y: int32, tags={tags/position/y}
```
Now add file called `data.json` to the `config` folder that contains:
```json
[
  {
    "id": "data/p",
    "type": "MyUiServer/Point",
    "value": {"x": -2, "y": 2}
  },
  {
    "id": "data/q",
    "type": "MyUiServer/Point",
    "value": {"x": 2, "y": 2}
  }
]
```
If you navigate the UI to the data scope (click the compas icon) while the VR viewer is active, you will see two squares. For an overview of available tags, see: https://cortoproject/tags

## Using VR
Because the viewer makes use of the A-FRAME framework (www.aframe.io) you can also use the viewer in VR mode. For this, you will need to open the webpage on a mobile phone, and press on the Google Cardboard icon (bottom of the viewer). Then turn the phone in horizontal mode, and the view will switch to a Google Cardboard compatible view.

