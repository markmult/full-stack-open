import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import Notification from "./components/Notification";
import Persons from "./components/Persons";
import personService from "./services/persons";
import PersonForm from "./components/PersonsForm";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [positive, setPositive] = useState(true);
  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLocaleLowerCase().includes(filter.toLowerCase())
        );

  useEffect(() => {
    personService.getAll().then((returnedPersons) => {
      setPersons(returnedPersons);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [notificationMessage]);

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.find((e) => e.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added. Do you want to replace number?`
        )
      ) {
        const personObject = {
          name: newName,
          number: newNumber,
        };
        const existingPerson = persons.find(
          (person) => person.name === newName
        );
        personService
          .update(existingPerson.id, personObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson
              )
            );
            setPositive(true);
            setNotificationMessage(`Updated ${newName}'s phonenumber`);
          })
          .catch((error) => {
            setPositive(false);
            setNotificationMessage(error.message);
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setPositive(true);
          setNotificationMessage(`Added ${newName} to phonebook`);
        })
        .catch((error) => {
          setPositive(false);
          setNotificationMessage(error.message);
        });
    }
    setNewName("");
    setNewNumber("");
  };

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then((returnedPersons) => {
        setPersons(persons.filter((person) => person.id !== id));
        setPositive(true);
        setNotificationMessage(`Phonenumber for ${newName} deleted`);
      });
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} positive={positive} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} removePerson={removePerson} />
    </div>
  );
};

export default App;
