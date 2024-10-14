// script.js

window.onload = function() {
    // Generar automáticamente el número de boleta al cargar la página
    document.getElementById('boletaNum').value = 'BO-' + Math.floor(Math.random() * 1000000);
};

function agregarFila() {
    const table = document.getElementById("repuestosTable").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3); // Nueva celda para Descripción
    const cell5 = newRow.insertCell(4); // Nueva celda para Estado

    cell1.innerHTML = '<input type="text" name="repuesto[]" required>';
    cell2.innerHTML = '<input type="number" name="cantidad[]" min="1" required>';
    cell3.innerHTML = '<input type="text" name="descripcion[]" required>'; // Nueva entrada para Descripción
    cell4.innerHTML = `
        <select name="estado[]">
            <option value="Correcto">Correcto</option>
            <option value="Defectuoso">Defectuoso</option>
        </select>`;
    cell5.innerHTML = '<button type="button" onclick="eliminarFila(this)">Eliminar</button>';
}

function eliminarFila(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

document.getElementById('serviceForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar envío automático

    const form = this;
    
    // Obtener todos los campos requeridos
    const email = form.email.value; // Asegúrate de tener un campo de email en tu formulario
    const horas = form.horas.value; // Asegúrate de tener un campo de horas en tu formulario

    // Validación para el correo electrónico
    if (!validarEmail(email)) {
        mostrarMensaje("Correo electrónico no es válido.", true);
        return;
    }

    // Validación para horas trabajadas
    if (horas <= 0) {
        mostrarMensaje("Las horas trabajadas deben ser mayores a 0.", true);
        return;
    }

    // Validación para repuestos
    const repuestos = form.querySelectorAll('input[name="repuesto[]"]');
    const cantidades = form.querySelectorAll('input[name="cantidad[]"]');
    const descripciones = form.querySelectorAll('input[name="descripcion[]"]');
    const estados = form.querySelectorAll('select[name="estado[]"]');

    for (let i = 0; i < repuestos.length; i++) {
        if (repuestos[i].value === "" || cantidades[i].value <= 0 || descripciones[i].value === "") {
            mostrarMensaje("Todos los campos de repuestos son obligatorios y deben ser válidos.", true);
            return;
        }
    }

    // Validación para los otros campos del formulario (asegúrate de incluir todos los campos que has agregado)
    const fieldsToCheck = [
        'cliente',
        'tecnico',
        'fecha',
        'numeroIncidencia',
        'modelo',
        'serie',
        'motivoServicio',
        'condicionEquipo',
        'accionTomada',
        'motivoLlamada',
        'ubicacionFalla',
        'tipoFalla',
        'horaInicialViaje',
        'horaFinalViaje',
        'horaInicialTrabajo',
        'horaFinalTrabajo',
    ];

    for (const field of fieldsToCheck) {
        const fieldValue = form[field]?.value;
        if (!fieldValue || fieldValue.trim() === "") {
            mostrarMensaje(`El campo ${field} es obligatorio.`, true);
            return;
        }
    }

    // Aquí se envía el formulario si todo está correcto
    form.submit();
});

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mostrarMensaje(mensaje, isError) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = mensaje;
    messageElement.style.color = isError ? 'red' : 'green';
}
