// ID4 SOLUTION LÀ GÌ?

'use strict';
const id4_solution__prefix = 'id4-solution--';
const id4_solution__byId = (id4_solution__name) => document.getElementById(id4_solution__prefix + id4_solution__name);
const id4_solution__find = (id4_solution__name) => document.querySelector('.' + id4_solution__prefix + id4_solution__name);
const id4_solution__findAll = (id4_solution__name) => [...document.querySelectorAll('.' + id4_solution__prefix + id4_solution__name)];
const id4_solution__solution = id4_solution__find('solution');
if ('IntersectionObserver' in window) {
    const id4_solution__observer = new IntersectionObserver((id4_solution__entries) => {
        id4_solution__entries.forEach((id4_solution__entry) => {
            if (id4_solution__entry.isIntersecting) {
                id4_solution__entry.target.classList.add('id4-solution--solution-visible');
                id4_solution__observer.unobserve(id4_solution__entry.target);
            }
        });
    }, { threshold: .12 });
    id4_solution__observer.observe(id4_solution__solution);
} else {
    id4_solution__solution.classList.add('id4-solution--solution-visible');
}

// end ID4 SOLUTION LÀ GÌ?

// QUY TRÌNH CỦA ID-4 IMPLANT SOLUTION