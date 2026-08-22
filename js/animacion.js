document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("area-flotante");
    const botones = Array.from(document.querySelectorAll(".btn-circulo"));

    // Guardar estado y velocidades iniciales
    const objetos = botones.map((btn) => {
        const radio = 55; // Mitad del ancho/alto (110px / 2)
        let x = Math.random() * (contenedor.clientWidth - radio * 2) + radio;
        let y = Math.random() * (contenedor.clientHeight - radio * 2) + radio;

        let vx = (Math.random() - 0.5) * 1.2;
        let vy = (Math.random() - 0.5) * 1.2;

        let pausado = false;

        // Pausar movimiento al pasar el cursor para poder hacer clic cómodamente
        btn.addEventListener("mouseenter", () => pausado = true);
        btn.addEventListener("mouseleave", () => pausado = false);

        return { element: btn, x, y, vx, vy, radio, get pausado() { return pausado; } };
    });

    function animar() {
        const cAncho = contenedor.clientWidth;
        const cAlto = contenedor.clientHeight;

        for (let i = 0; i < objetos.length; i++) {
            let obj = objetos[i];

            if (!obj.pausado) {
                obj.x += obj.vx;
                obj.y += obj.vy;

                // Rebotes con los límites de la caja
                if (obj.x - obj.radio <= 0) {
                    obj.x = obj.radio;
                    obj.vx *= -1;
                } else if (obj.x + obj.radio >= cAncho) {
                    obj.x = cAncho - obj.radio;
                    obj.vx *= -1;
                }

                if (obj.y - obj.radio <= 0) {
                    obj.y = obj.radio;
                    obj.vy *= -1;
                } else if (obj.y + obj.radio >= cAlto) {
                    obj.y = cAlto - obj.radio;
                    obj.vy *= -1;
                }
            }

            // Detección de choque entre esferas
            for (let j = i + 1; j < objetos.length; j++) {
                let obj2 = objetos[j];
                let dx = obj2.x - obj.x;
                let dy = obj2.y - obj.y;
                let distancia = Math.sqrt(dx * dx + dy * dy);
                let minDistancia = obj.radio + obj2.radio;

                if (distancia < minDistancia) {
                    let tempVx = obj.vx;
                    let tempVy = obj.vy;
                    obj.vx = obj2.vx;
                    obj.vy = obj2.vy;
                    obj2.vx = tempVx;
                    obj2.vy = tempVy;

                    let solapamiento = minDistancia - distancia;
                    let nx = dx / (distancia || 1);
                    let ny = dy / (distancia || 1);

                    if (!obj.pausado) {
                        obj.x -= nx * (solapamiento / 2);
                        obj.y -= ny * (solapamiento / 2);
                    }
                    if (!obj2.pausado) {
                        obj2.x += nx * (solapamiento / 2);
                        obj2.y += ny * (solapamiento / 2);
                    }
                }
            }

            // Renderizar la posición calculada
            obj.element.style.left = `${obj.x - obj.radio}px`;
            obj.element.style.top = `${obj.y - obj.radio}px`;
        }

        requestAnimationFrame(animar);
    }

    animar();
});