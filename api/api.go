package main

// Dependencies for this sample.
import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/rs/xid"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
	"os"
	"strconv"
)

// Task struct for our CRUD sample.
type Task struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Deadline string `json:"deadline"`
}

// Our database mongo object.
var db *mgo.Database

// GetList Returns all the records in the mongo `tasks` collection.
func GetList(w http.ResponseWriter, r *http.Request) {
	var list []Task
	// Allow CORS here By * or specific origin
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,access-control-allow-origin, access-control-allow-headers")
	db.C("tasks").Find(bson.M{}).All(&list)
	// Encoding all the array.
	json.NewEncoder(w).Encode(list)
}

// GetTask Returns the record with the match id.
func GetTask(w http.ResponseWriter, r *http.Request) {
	//Allow CORS here By * or specific origin
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,access-control-allow-origin, access-control-allow-headers")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	params := mux.Vars(r)
	task := &Task{}
	ID, _ := strconv.Atoi(params["id"])
	// Find the task with the id.
	db.C("tasks").Find(bson.M{"id": ID}).One(&task)
	// Expose the json with the data found.
	json.NewEncoder(w).Encode(task)
}

//AddTask Adds a new record in the mongo ´tasks´ collection.
func AddTask(w http.ResponseWriter, r *http.Request) {
	var list []Task
	//Allow CORS here By * or specific origin
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,access-control-allow-origin, access-control-allow-headers")
	var task Task
	// Get the params in body and trasform into a task object.
	_ = json.NewDecoder(r.Body).Decode(&task)

	if task.Name != "" {
		// Add the record in the collection.
		task.ID = generateID()
		db.C("tasks").Insert(task)
	}
	// Expose the result set after adding the new task.
	db.C("tasks").Find(bson.M{}).All(&list)
	json.NewEncoder(w).Encode(list)
}

// ModifyTask Modifies the values of the record with the match id.
func ModifyTask(w http.ResponseWriter, r *http.Request) {
	var list []Task
	//Allow CORS here By * or specific origin
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,access-control-allow-origin, access-control-allow-headers")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	params := mux.Vars(r)
	var task Task
	// Get the params in body and trasform into a task object.
	_ = json.NewDecoder(r.Body).Decode(&task)
	ID, _ := strconv.Atoi(params["id"])
	task.ID = ID
	// Update the record.
	db.C("tasks").Update(bson.M{"id": ID}, task)
	// Expose the result set after modify the task.
	db.C("tasks").Find(bson.M{}).All(&list)
	json.NewEncoder(w).Encode(list)
}

// DeleteTask Removes the task with the match id from the collection.
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	var list []Task
	//Allow CORS here By * or specific origin
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,access-control-allow-origin, access-control-allow-headers")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	params := mux.Vars(r)
	// Get the id from params and remove the record.
	ID, _ := strconv.Atoi(params["id"])
	db.C("tasks").Remove(bson.M{"id": ID})
	// Expose the result set after delete the task.
	db.C("tasks").Find(bson.M{}).All(&list)
	json.NewEncoder(w).Encode(list)
}

/**
 * @function generateID();
 *
 * Helper function to generate an integer to fill the ID field of a task.
 */
func generateID() int {
	return int(xid.New().Counter())
}

func main() {
	ip := os.Getenv("MONGO_IP")
	port := os.Getenv("MONGO_PORT")
  env := os.Getenv("DOCKER_ENV")

	if ip == "" {
		if env != "" {
			ip = "db"
			log.Printf("No environment var $MONGO_IP was found, assuming 'db' docker container address.")
		} else {
			ip = ""
			log.Printf("No environment var $MONGO_IP was found, assuming 'localhost'.")
		}
	}

	if port == "" {
		port = "27017"
		log.Printf("No environment var $MONGO_PORT was found, assuming '27017'.")
	}

	// Connection with mongo.
	session, err := mgo.Dial(ip + ":" + port)
	if err != nil {
		log.Fatal(err.Error())
	}
	defer session.Close()

	log.Printf("Connection with MongoDb stablished [%s:%s].", ip, port)

	session.SetMode(mgo.Monotonic, true)
	db = session.DB("test")
	// Routering.
	router := mux.NewRouter()
	// Defining our endpoints.
	router.HandleFunc("/API/task", GetList).Methods("GET", "OPTIONS")
	router.HandleFunc("/API/task", AddTask).Methods("POST", "OPTIONS")
	router.HandleFunc("/API/task/{id}", GetTask).Methods("GET", "OPTIONS")
	router.HandleFunc("/API/task/{id}", DeleteTask).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/API/task/{id}", ModifyTask).Methods("PUT", "OPTIONS")

	// Serve the API in port 3001.
	log.Fatal(http.ListenAndServe(":3001", router))
	log.Printf("API Ready and listening at :3001")
}
