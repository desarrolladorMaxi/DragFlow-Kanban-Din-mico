const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const lanesContainer = document.querySelector(".lanes");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim().toLowerCase();

    if (!value) return;

    if (value.startsWith("eliminar ")) {
        const columnNameToDelete = value.substring("eliminar ".length);
        deleteColumn(columnNameToDelete);
    } else if (value === "add column") {
        addNewColumn();
    } else {
        addNewTask(value);
    }

    input.value = "";
});

function deleteColumn(columnName) {
  if (columnName.toLowerCase() === "inbox") {
      console.log("No se puede eliminar la columna 'Inbox'.");
      return;
  }

  const confirmMessage = `¿Solo podra eliminar una columna por vez "${columnName}" MUEVA LOS PROSPECTOS A OTRA COLUMNA O SERÁN ELIMINADOS.`;
  if (confirm(confirmMessage)) {
      const columns = document.querySelectorAll('.swim-lane');
      columns.forEach((column) => {
          const heading = column.querySelector('.heading');
          if (heading && heading.innerText.trim().toLowerCase() === columnName) {
              column.remove();
              console.log("Columna eliminada:", columnName);
          }
      });
  } else {
      console.log("Eliminación de columna cancelada.");
  }
}



const addNewTask = (value) => {
    const newTask = document.createElement("p");
    newTask.classList.add("task"); /* elemento css */
    newTask.setAttribute("draggable", "true");/* arrastra y suelta */
    newTask.innerText = value;/* taskText,....  Establece el texto de la tarea con el valor recibido como parámetro en la función. */

    newTask.addEventListener("dragstart", () => {
        newTask.classList.add("is-dragging");/* cambia el color */
    });

    newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging");
    });

    newTask.addEventListener("dragstart", () => {
        newTask.classList.add("is-dragging");
    });

    newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging");
    });

    const inboxLane = document.getElementById("todo-lane");
    inboxLane.appendChild(newTask)
    
};


const addNewColumn = () => {
    const newColumn = document.createElement("div");
    newColumn.classList.add("swim-lane");
    newColumn.classList.add("new-column");
    makeColumnDraggable(newColumn);
  
    const heading = document.createElement("h3");
    heading.classList.add("heading");
    heading.innerText = "Nueva Columna";/* titulo de la tarjeta */
  
    heading.addEventListener("blur", () => {
      heading.contentEditable = false;
    });
  
    heading.addEventListener("click", () => {
      heading.contentEditable = true;
      heading.focus();
    });
    
    newColumn.appendChild(heading);
    makeColumnDraggable(newColumn);
    lanesContainer.appendChild(newColumn);
  
    
  };

  function makeColumnDraggable(column) {
    column.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("heading")) {
        e.preventDefault();
        return;
      }
    });
  
    column.addEventListener("dragend", () => {
      column.classList.remove("is-dragging");
    });
  
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
  
    column.addEventListener("drop", (e) => {
      e.preventDefault();
  
      const taskOrColumn = document.querySelector(".is-dragging");
  
      if (taskOrColumn) {
        if (taskOrColumn.classList.contains("task")) {
          // Verificamos si la tarea se está arrastrando sobre una nueva columna
          if (column.classList.contains("new-column")) {
            column.appendChild(taskOrColumn);
          }
        } else if (taskOrColumn.classList.contains("swim-lane")) {
          lanesContainer.insertBefore(taskOrColumn, column);
        }
      }
    });
  }

  function insertAboveColumn(container, mouseX) {
    // Esta función encuentra la columna que está debajo del cursor del mouse y
    // devuelve esa columna.
  
    const columns = container.querySelectorAll(".column:not(.is-dragging)");
  
    let targetColumn = null;
    let closestOffset = Number.NEGATIVE_INFINITY;
  
    columns.forEach((col) => {
      const { left, right } = col.getBoundingClientRect();
  
      const offsetLeft = mouseX - (left + right) / 2; // Calcula la distancia entre el cursor del mouse y el centro de la columna.
      const offsetRight = right - mouseX;
  
      const columnMargin = parseInt(getComputedStyle(col).marginLeft); // Obtiene el margen izquierdo de la columna.
  
      if (offsetLeft > 0 && offsetRight > 0 && offsetLeft > closestOffset) {
        closestOffset = offsetLeft;
        targetColumn = col;
      }
    });
  
    return targetColumn;
  }