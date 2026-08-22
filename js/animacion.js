document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("area-flotante");
    const botones = Array.from(document.querySelectorAll(".btn-circulo"));

    function obtenerRadio() {
        // Si la pantalla es muy pequeña (móvil o móvil horizontal), esferas más chicas
        if (window.innerWidth <= 768 || window.innerHeight <= 500) {
            return 35; // 70px / 2
        }
        return 55; // 110px / 2 (PC)
    }

    const objetos = botones.map((btn) => {
        let radio = obtenerRadio();
        let x = Math.random() * (contenedor.clientWidth - radio * 2) + radio;
        let y = Math.random() * (contenedor.clientHeight - radio * 2) + radio;

        let vx = (Math.random() - 0.5) * 1.2;
        let vy = (Math.random() - 0.5) * 1.2;

        let pausado = false;

        btn.addEventListener("mouseenter", () => pausado = true);
        btn.addEventListener("mouseleave", () => pausado = false);
        btn.addEventListener("touchstart", () => pausado = true);
        btn.addEventListener("touchend", () => pausado = false);

        return { element: btn, x, y, vx, vy, get radio() { return obtenerRadio(); }, get pausado() { return pausado; } };
    });

    function animar() {
        const cAncho = contenedor.clientWidth;
        const cAlto = contenedor.clientHeight;

        for (let i = 0; i < objetos.length; i++) {
            let obj = objetos[i];
            let r = obj.radio;

            if (!obj.pausado) {
                obj.x += obj.vx;
                obj.y += obj.vy;

                // Control de bordes
                if (obj.x - r <= 0) {
                    obj.x = r;
                    obj.vx *= -1;
                } else if (obj.x + r >= cAncho) {
                    obj.x = cAncho - r;
                    obj.vx *= -1;
                }

                if (obj.y - r <= 0) {
                    obj.y = r;
                    obj.vy *= -1;
                } else if (obj.y + r >= cAlto) {
                    obj.y = cAlto - r;
                    obj.vy *= -1;
                }
            }

            // Colisión entre esferas
            for (let j = i + 1; j < objetos.length; j++) {
                let obj2 = objetos[j];
                let r2 = obj2.radio;
                let dx = obj2.x - obj.x;
                let dy = obj2.y - obj.y;
                let distancia = Math.sqrt(dx * dx + dy * dy);
                let minDistancia = r + r2;

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

            obj.element.style.left = `${obj.x - r}px`;
            obj.element.style.top = `${obj.y - r}px`;
        }

        requestAnimationFrame(animar);
    }

    animar();
});