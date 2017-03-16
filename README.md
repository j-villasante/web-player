# web-player

## Requirements
* [Node.js](https://nodejs.org)
* [Gulp](http://gulpjs.com)

## Steps for running
1. Build the frontend scripts using browserify
```
gulp browserify
```
2. Create a folder named **data** on the proyect parent folder.
3. Create a file named **users.json** on the folder /data just created. The file **users.json** must follow the following structure. The password are hashed using bcrypt.
```
{
	"users": [
		{
			"id": 1,
			"username": "josue",
			"password": "$2a$10$1efLLmtcC/Hau4BpBd4Id.tljMg6uwvrww4TIv1ImsLu7kpyde8si"
		}
	]
}
```
4. Create a file named **data.json** on the folder /data just created. The file **data.json** must follow the following structure. The url on video and on subtitle for each movie are relative to mediaRoot.
```
{
    "mediaRoot": "/static/media",
    "movies": [
        {
            "path": "example",
            "name": "a example name",
            "video": "/example/movie.mp4",
            "subtitle": "/example/subtitle.vtt" 
        }
    ],
    "_locals": {}
}
```
5. Create a folder name **media** on the already existing folder **static**. The movies are contained on this folder and must follow the following structure.
```
/static/media
    |__ movie1
        |__ movieFile.mp4
        |__ subtitleFile.vtt
    |__ movie2
        ...
```
6. Run main.js using node.
```
node main.js
```
7. You can access the project on localhost:3000

## Developer
You can run the developer task of gulp. It is the default task.
```
gulp
```
