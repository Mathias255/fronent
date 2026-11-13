import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hay caminos');
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
    expect(compiled.querySelector('#welcome-title')?.textContent).toContain('No se trata solo de llegar');
    expect(compiled.querySelector('.trail-empty')?.textContent).toContain('No mostramos recorridos aproximados');
    expect(compiled.querySelector('a[href="/descubrir.html"]')?.textContent).toContain('Descubrir');
    expect(compiled.querySelector('a[href="/senderos.html"]')?.textContent).toContain('Senderos');
    expect(compiled.querySelector('a[href="/guias.html"]')?.textContent).toContain('Guías y equipo');
  });
});
